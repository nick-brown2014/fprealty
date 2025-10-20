const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  try {
    // Try to get API key info by attempting to list domains
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Domains response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
