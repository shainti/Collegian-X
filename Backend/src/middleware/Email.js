// const transporter = require("../middleware/Email.confiq");

// const sendVerificationCode = async (email, verificationCode) => {
//   try {
//     const response = await transporter.sendMail({
//       from: '"CollegianX" <collegianx@gmail.com>',
//       to: email,
//       subject: "Verify your email",
//       text: `Your verification code is ${verificationCode}`,
//       html: `<h2>Your verification code</h2><p><b>${verificationCode}</b></p>`,
//     });

//     console.log("Verification email sent:", response.messageId);
//   } catch (error) {
//     console.error("Email error:", error);
//   }
// };

// module.exports = sendVerificationCode;
