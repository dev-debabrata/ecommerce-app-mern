import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("EMAIL_USER or EMAIL_PASS missing in .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordMail = async (email, resetLink) => {
  await transporter.sendMail({
    from: `"Debabrata Shop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset.</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
};

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendResetPasswordMail = async (email, resetLink) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Reset Your Password",
//     html: `
//       <h2>Password Reset Request</h2>

//       <p>You requested a password reset.</p>

//       <p>
//         Click the link below to reset your password:
//       </p>

//       <a href="${resetLink}">
//         Reset Password
//       </a>

//       <p>This link expires in 1 hour.</p>
//     `,
//   });
// };
