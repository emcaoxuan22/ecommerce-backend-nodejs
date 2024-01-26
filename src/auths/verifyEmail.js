const nodemailer = require("nodemailer");
const verifyEmail = async (emailVerificationCode, verificationCode) => {};
const sendVerificationEmail = async (usr_email, verificationCode) => {
  // Tạo transporter nodemailer (cấu hình email gửi đi)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "emcaoxuan22@gmail.com",
      pass: "prai zsvz zhyi msfu", // Sử dụng mật khẩu ứng dụng đã tạo hoặc mật khẩu chính
    },
  });

  // Tạo nội dung email
  const mailOptions = {
    from: "emcaoxuan23@gmail.com",
    to: usr_email,
    subject: "Xác minh email",
    text: `Mã xác minh của bạn là: ${verificationCode}`,
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
    } else {
      console.log("Verification email sent:", info.response);
    }
  });
};

module.exports = {
  verifyEmail,
  sendVerificationEmail,
};
