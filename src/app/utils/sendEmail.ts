import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });
  await transporter.sendMail({
    from: config.smtp_user,
    to,
    subject: 'Please! reset your password within 10 minutes ',
    text: '',
    html,
  });
};
