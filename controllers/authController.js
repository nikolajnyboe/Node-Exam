const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');
const sms = require('../handlers/sms');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login',
  successRedirect: '/',
  successFlash: 'You are logged in'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out 👋');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in to do that');
  res.redirect('/login');
};

exports.forgot = async (req, res) => { //send password reset link to user
  //is there a user?
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    req.flash('error', 'No user with that email');
    return res.redirect('/login')
  }
  // set reset token and expiry
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save();
  //send email and sms with reset link
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    subject: 'Password Reset',
    resetURL,
    filename: 'password-reset'
  });
  const message = 'Password reset link: ' + resetURL;
  if (user.phone) {
    await sms.send(user.phone, message);
  }
  req.flash('success', `An email and a SMS has been sent with a password reset link.`);

  res.redirect('/login');
};

exports.reset = async (req, res) => { //if token is valid, show the reset form
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()} //check if in the future = token is still valid
  });
  if (!user) {
    req.flash('error', 'Token is invalid or expired');
    return res.redirect('/login');
  }

  res.render('reset', {title: 'Reset Password'});
};

exports.confirmedPasswords = (req, res, next) => { //if passwords match, run updatePassword()
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back')
};

exports.updatePassword = async (req, res) => { //if token is still valid, update password and log user in
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()} //check if in the future = token is still valid
  });
  if (!user) {
    req.flash('error', 'Token is invalid or expired');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();

  await req.login(updatedUser);
  req.flash('success', 'Password has been reset and you are logged in');
  res.redirect('/');
};