import nodemailer from 'nodemailer';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from './errorHandler.js';

const sendEmail = catchAsyncError(async ({email, subject, message, next}) => {

  const transporter = nodemailer.createTransport({
    service: `${process.env.SMTP_SERVICE}`,
    auth: {
      user: `${process.env.SMTP_FROM_EMAIL}`,
      pass: `${process.env.SMTP_PASSWORD}`,
    },
  });

  let mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`, // <-- sender name here
    to: email,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      return next(new ErrorHandler(error, 404));
    }
    console.log('Message sent:', info.response);
  });
})

export default sendEmail;