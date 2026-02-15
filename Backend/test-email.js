require('dotenv').config();
const nodemailer = require("nodemailer");

console.log('=== Email Configuration Test ===');
console.log('Email:', process.env.Collegian_Email);
console.log('Password exists:', !!process.env.Collegian_pass);
console.log('Password length:', process.env.Collegian_pass?.length);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Collegian_Email,
    pass: process.env.Collegian_pass,
  },
});

// Test the connection
async function testConnection() {
  try {
    console.log('\n--- Testing SMTP Connection ---');
    await transporter.verify();
    console.log('✅ SMTP Connection successful!');
    
    // Try sending a test email
    console.log('\n--- Sending Test Email ---');
    const info = await transporter.sendMail({
      from: '"Leave Portal" <collegainx@gmail.com>',
      to: 'collegainx@gmail.com', // Send to yourself for testing
      subject: 'Test Email',
      text: 'This is a test email',
      html: '<b>This is a test email</b>',
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();