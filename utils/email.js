const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

class Email {
  constructor(user, url) {
    this.user = user;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.from = `from website <${process.env.EMAIL_FROM}>`;
  }

  async sendForgotPassword() {
    await this.send(
      'forgotPassword',
      'Your password reset email (valid in 3 minutes)',
    );
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Social Media');
  }

  send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      filename: this.firstName,
      subject: this.subject,
      url: this.url,
    });
    const optionsInfo = {
      from: this.from,
      to: this.user.email,
      subject,
      text: convert(html),
      html,
    };
    return this.newTransport().sendMail(optionsInfo);
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') return;

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}

// const sendEmail = async options => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const optionsInfo = {
//     from: 'socialnetwork <socialnetwork@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transporter.sendMail(optionsInfo);
// };
module.exports = Email;
