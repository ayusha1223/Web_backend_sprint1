import nodemailer from "nodemailer";

export const sendResetEmail = async (
  to: string,
  resetLink: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset</h3>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
};
