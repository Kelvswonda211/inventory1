const nodemailer = require("nodemailer");

const sendEmail = asyncHandler(
  async (subject, message, send_from, send_to, reply_to) => {
    // create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      PORT: 587,
      auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // options for sending my email
    const options = {
      from: sent_from,
      to: sent_to,
      replyTo: reply_to,
      subject: subject,
      html: message,
    };

    // send email
    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
);

module.exports = sendEmail;
