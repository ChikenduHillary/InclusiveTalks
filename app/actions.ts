"use server";
// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail email address
    pass: process.env.EMAIL_PASS, // your gmail password or app-specific password
  },
});

export const sendEmail = async (toEmail: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Welcome to Inclusive Talks!",
      html: `
        <h2>Dear friend,</h2>
        <p>Thank you for subscribing to Inclusive Talks! As a blog, we are dedicated to promoting diversity and inclusion among youths. Our pen is our biggest tool for achieving this.</p>
        <p>We are delighted to have you join our community of thoughtful readers and engaged individuals.</p>
        <p>As you begin this journey with us, we highly recommend checking out our latest blog posts. Here are three of our recent articles that might be of interest to you:</p>
        <ol>
          <li><a href="https://www.inclusivetalks.org/Blog%20Page/blog.html">Religion: The Accidental Enemy</a></li>
          <li><a href="https://www.inclusivetalks.org/Blog%20Page/blog.html">Inclusion, Not Indoctrination</a></li>
          <li><a href="https://www.inclusivetalks.org/Blog%20Page/blog.html">Diversity And Inclusion: This Ability</a></li>
        </ol>
        <p>We hope you enjoy these reads and look forward to sharing more insightful content with you in the future.</p>
        <p>Warm Regards,<br>Inclusive Talks<br><em>Dedicated to Diversity!</em></p>
      `,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
          return info;
        }
      });
    });
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`);
  }
};
