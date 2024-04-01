const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "pratyushnamdev140@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });

 module.exports = {transporter };