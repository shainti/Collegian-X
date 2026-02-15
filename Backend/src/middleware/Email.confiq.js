const nodemailer = require("nodemailer");

console.log('\n=== EMAIL CONFIGURATION CHECK ===');
console.log('Email:', process.env.Collegian_Email);
console.log('Password:', process.env.Collegian_pass ? '✅ EXISTS' : '❌ MISSING');
console.log('================================\n');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Collegian_Email,
    pass: process.env.Collegian_pass,
  },
  // Add these options
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
});

// Test connection - make it synchronous with await
console.log('🔄 Testing email server connection...');
(async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified!\n');
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    console.error('This will cause email sending to fail!\n');
  }
})();

const sendverificationcode = async (email, verificationCode) => {
  try {
    const info = await transporter.sendMail({
      from: '"Collegian X" <collegainx@gmail.com>',
      to: email,
      subject: "Verify Your Email Address",
      text: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
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
    });
    console.log('✅ Verification email sent to:', email);
    return info;
  } catch (error) {
    console.log("❌ Verification Email Error:", error.message);
    throw error;
  }
};

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Assignment Portal" <collegainx@gmail.com>`,
      to,
      subject,
      html,
    });
    console.log('✅ Assignment email sent to:', to);
    return info;
  } catch (error) {
    console.error('❌ Assignment email failed:', error.message);
    throw error;
  }
};

const sendLeaveMail = async({to, subject, html}) => {
  try {
    console.log('\n🔵 sendLeaveMail called');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Transporter exists:', !!transporter);
    
    const info = await transporter.sendMail({
      from: `"Leave Portal" <collegainx@gmail.com>`,
      to,
      subject,
      html,
    });
    
    console.log('✅ Leave email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Leave email failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', JSON.stringify(error, null, 2));
    throw error;
  }
}

module.exports = {
  sendMail,
  sendverificationcode,
  sendLeaveMail,
};