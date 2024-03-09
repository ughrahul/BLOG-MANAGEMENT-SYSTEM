const nodemailer = require("nodemailer");

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // Ensure it matches your server's SSL/TLS configuration
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Define mailer function
const mailer = async (email, subject, body) => {
  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Rahul Kumar Mandal" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: `<b>${body}</b>`,
    });
    console.log("Email sent:", info);
    return info.messageId;
  } catch (error) {
    console.error("Failed to send email:", error);
    // Include the specific error message in the thrown error
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = { mailer };
