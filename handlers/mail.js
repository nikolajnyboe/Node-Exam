const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 25,
  auth: {
    user: "postmaster@mg.nyboe.co",
    pass: "6f10c16da6775ccd82c3edf3ca253fae-115fe3a6-1834cdb2"
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `Nikolaj Nyboe <nikolaj@nyboe.dk>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };

  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}