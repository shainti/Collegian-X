const brevo = require('@getbrevo/brevo');

console.log('\n=== BREVO API CONFIGURATION ===');
console.log('API Key exists:', !!process.env.BREVO_API_KEY);
console.log('API Key preview:', process.env.BREVO_API_KEY ? `${process.env.BREVO_API_KEY.substring(0, 15)}...` : 'MISSING');
console.log('From Email:', process.env.SMTP_FROM_EMAIL);
console.log('===================================\n');

// Configure Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendverificationcode = async (email, verificationCode) => {
  try {
    console.log('📧 Sending verification email to:', email);
    
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Verify Your Email Address';
    sendSmtpEmail.sender = { 
      name: 'Collegian X', 
      email: process.env.SMTP_FROM_EMAIL 
    };
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.htmlContent = `
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
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">
                      Email Verification
                    </h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px 40px 30px;">
                    <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                      Hello,
                    </p>
                    
                    <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                      Thank you for signing up with Collegian X. To complete your registration, please use the verification code below:
                    </p>
                    
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
                
                <tr>
                  <td style="padding: 30px 40px 40px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                      Best regards,<br>
                      The Collegian X Team
                    </p>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `;
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Verification email sent, ID:', data.messageId);
    return { id: data.messageId };
  } catch (error) {
    console.error("❌ Verification Email Error:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};

const sendMail = async ({ to, subject, html }) => {
  try {
    console.log('📧 Sending assignment email to:', to);
    
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.sender = { 
      name: 'Assignment Portal', 
      email: process.env.SMTP_FROM_EMAIL 
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.htmlContent = html;
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Assignment email sent, ID:', data.messageId);
    return { id: data.messageId };
  } catch (error) {
    console.error('❌ Assignment email failed:', error.message);
    console.error("Full error:", error);
    throw error;
  }
};

const sendLeaveMail = async ({ to, subject, html }) => {
  try {
    console.log('\n🔵 sendLeaveMail called (using Brevo API)');
    console.log('To:', to);
    console.log('Subject:', subject);
    
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.sender = { 
      name: 'Leave Portal', 
      email: process.env.SMTP_FROM_EMAIL 
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.htmlContent = html;
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Leave email sent successfully!');
    console.log('Email ID:', data.messageId);
    console.log('');
    return { id: data.messageId };
  } catch (error) {
    console.error('❌ Leave email failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

module.exports = {
  sendMail,
  sendverificationcode,
  sendLeaveMail,
};