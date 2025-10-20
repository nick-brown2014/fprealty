const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('API Key (first 10 chars):', process.env.RESEND_API_KEY?.substring(0, 10));

async function test() {
  try {
    // Try to send a simple test email
    const result = await resend.emails.send({
      from: 'noreply@alerts.nocorealtor.com',
      to: ['nick.brown2014@gmail.com'],
      subject: 'Test Email',
      html: '<p>This is a test</p>'
    });

    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();