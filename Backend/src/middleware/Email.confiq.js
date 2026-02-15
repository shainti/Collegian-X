const nodemailer = require('nodemailer');

console.log('\n=== BREVO EMAIL CONFIGURATION ===');
console.log('SMTP User exists:', !!process.env.SMTP_USER);
console.log('SMTP Password exists:', !!process.env.SMTP_PASSWORD);
console.log('SMTP From Email:', process.env.SMTP_FROM_EMAIL);
console.log('===================================\n');

// Create transporter with Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

const sendverificationcode = async (email, verificationCode) => {
  try {
    console.log('📧 Sending verification email to:', email);
    
    const mailOptions = {
      from: `"Collegian X" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;">
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
            <tr>
              <td style="padding: 40px 20px;">
                
                <!-- Email Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">
                        Email Verification
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 40px 30px;">
                      <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                        Hello,
                      </p>
                      
                      <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                        Thank you for signing up with Collegian X. To complete your registration, please use the verification code below:
                      </p>
                      
                      <!-- Verification Code -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 24px; background-color: #f9fafb; border: 2px solid #3b82f6; border-radius: 6px; text-align: center;">
                            <div style="font-size: 32px; font-weight: 700; color: #3b82f6; letter-spacing: 6px; font-family: monospace;">
                              ${verificationCode}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                        This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                        Best regards,<br>
                        The Collegian X Team
                      </p>
                      <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">
                        If you need help, please contact us at <a href="mailto:support@collegianx.com" style="color: #3b82f6; text-decoration: none;">support@collegianx.com</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
                <!-- Bottom Notice -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 20px auto 0;">
                  <tr>
                    <td style="text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                        © 2024 Collegian X. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent, ID:', info.messageId);
    return { id: info.messageId };
  } catch (error) {
    console.error("❌ Verification Email Error:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};

const sendMail = async ({ to, subject, html }) => {
  try {
    console.log('📧 Sending assignment email to:', to);
    
    const mailOptions = {
      from: `"Assignment Portal" <${process.env.SMTP_FROM_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Assignment email sent, ID:', info.messageId);
    return { id: info.messageId };
  } catch (error) {
    console.error('❌ Assignment email failed:', error.message);
    console.error("Full error:", error);
    throw error;
  }
};

const sendLeaveMail = async ({ to, subject, html }) => {
  try {
    console.log('\n🔵 sendLeaveMail called (using Nodemailer + Brevo)');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Transporter exists:', !!transporter);
    
    const mailOptions = {
      from: `"Leave Portal" <${process.env.SMTP_FROM_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Leave email sent successfully!');
    console.log('Email ID:', info.messageId);
    console.log('');
    return { id: info.messageId };
  } catch (error) {
    console.error('❌ Leave email failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    console.error('Full error:', error);
    throw error;
  }
};

module.exports = {
  sendMail,
  sendverificationcode,
  sendLeaveMail,
};