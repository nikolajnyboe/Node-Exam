const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = async (req, res) => {
  res.render('login', {title: 'Login'});
};

exports.registerForm = async (req, res) => {
  res.render('register', {title: 'Register'});
};

// Validation mittleware
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Please fill out name').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('phone', 'Please fill out phone no.').notEmpty();
  req.checkBody('password', 'Password can not be blank').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password can not be blank').notEmpty();
  req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {title: 'Register', body: req.body, flashes: req.flash()});
    return; // stop
  }
  next(); // continue
};

exports.register = async (req, res, next) => {
  const user = new User({email: req.body.email, name: req.body.name, phone: req.body.phone});
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.account = async (req, res) => {
  res.render('account', {title: 'Edit Your Account'});
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  const user = await User.findByIdAndUpdate(
    {_id: req.user._id}, //query
    {$set: updates}, //updates
    {new: true, runValidators: true, context: 'query'} //options
  );

  req.flash('success', 'Your profile has been updated')
  res.redirect('back');
};