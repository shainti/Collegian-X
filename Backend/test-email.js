require('dotenv').config();
const { sendLeaveMail } = require('./src/middleware/Email.confiq');

async function test() {
  try {
    await sendLeaveMail({
      to: 'shaintykashyap@gmail.com',
      subject: 'Test Email - Collegian X',
      html: '<h1>Test Email</h1><p>If you receive this, Brevo API is working! ✅</p>'
    });
    console.log('✅ Test passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();