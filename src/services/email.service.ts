import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendResetEmail = async (
  to: string,
  resetLink: string
) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    to,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset</h3>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
};

export const sendOrderEmail = async (
  to: string,
  name: string,
  message: string,
  orderId: string
) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    to,
    subject: "Order Update - Naayu Attire",
    html: `
      <h2>Hello ${name}</h2>
      <p>${message}</p>
      <p>Order ID: ${orderId}</p>
    `,
  });
};