const nodemailer = require('nodemailer');

const sendEmail = async function (options) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  //mailoptions
  const mailoptions = {
    from: 'Clement Owireku-Bogyah <admin@admin.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: [
      {
        filename: options.title,
        path: options.fileUrl,
      },
    ],
  };

  await transporter.sendMail(mailoptions);
};
module.exports = sendEmail;
