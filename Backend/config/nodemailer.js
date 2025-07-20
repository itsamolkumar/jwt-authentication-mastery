import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // ✅ For Brevo (formerly Sendinblue)
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // ✅ pulls from .env
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
