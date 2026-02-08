const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "collegainx@gmail.com",
    pass: "cjritakhlblosmbo", 
  },
});

// Export a function that sends verification emails
const sendverificationcode = async (email, verificationCode) => {
  try {
    const info = await transporter.sendMail({
      from: '"Collegian X" <collegianx@gmail.com>', // Fixed typo: was "collegainx"
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${verificationCode}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
    
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.log("❌ Email Error:", error.message);
    throw error; // Re-throw so the controller can handle it
  }
};

module.exports = sendverificationcode;

// Uncomment to test
// sendverificationcode("samgaming761@gmail.com", "123456");