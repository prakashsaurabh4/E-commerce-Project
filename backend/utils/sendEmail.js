const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // If email credentials are not set up in .env, skip gracefully without crashing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(
      "Nodemailer: Email credentials missing in .env. Skipping email dispatch.",
    );
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"FastShop" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Email could not be sent:", error.message);
  }
};

module.exports = sendEmail;
