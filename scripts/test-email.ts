import { sendEmail, generateBookingConfirmationEmail, generateTransferBookingEmail } from '../lib/email';

// Load environment variables
if (!process.env.BREVO_API_KEY) {
  const dotenv = require('dotenv');
  dotenv.config();
}

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testEmailSystem() {
  console.log('🧪 Email System Test Script\n');
  console.log('='.repeat(60));

  // Check environment variables
  console.log('\n📋 Environment Configuration:');
  console.log('─'.repeat(60));
  console.log(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || 'info@funnytourism.com (default)'}`);
  console.log(`EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME || 'Funny Tourism (default)'}`);
  console.log(`ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'info@funnytourism.com (default)'}`);

  if (!process.env.BREVO_API_KEY) {
    console.log('\n⚠️  WARNING: BREVO_API_KEY is not set!');
    console.log('Add it to your .env file:');
    console.log('BREVO_API_KEY=your-api-key-here\n');
    console.log('Emails will be logged to console only, not actually sent.\n');
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🧪 Test 1: Simple Text Email');
  console.log('─'.repeat(60));

  const simpleTest = await sendEmail({
    to: 'test@example.com',
    subject: 'Test Email - Simple',
    html: '<h1>Test Email</h1><p>This is a simple test email from Funny Tourism.</p>'
  });

  console.log('Result:', simpleTest);

  // Wait 2 seconds before next test to avoid rate limiting
  console.log('\n⏳ Waiting 2 seconds before next test...');
  await delay(2000);

  console.log('\n' + '='.repeat(60));
  console.log('\n🧪 Test 2: Package Booking Confirmation Email');
  console.log('─'.repeat(60));

  const bookingEmailHtml = generateBookingConfirmationEmail({
    guestName: 'John Smith',
    packageName: '7 Days Istanbul & Cappadocia Tour',
    travelDate: new Date('2025-06-15'),
    duration: '7 Days / 6 Nights',
    adults: 2,
    children3to5: 1,
    children6to10: 0,
    hotelCategory: 'fivestar',
    totalPrice: 1850
  });

  const bookingTest = await sendEmail({
    to: 'customer@example.com',
    subject: 'Booking Confirmation - Funny Tourism',
    html: bookingEmailHtml
  });

  console.log('Result:', bookingTest);

  // Wait 2 seconds before next test to avoid rate limiting
  console.log('\n⏳ Waiting 2 seconds before next test...');
  await delay(2000);

  console.log('\n' + '='.repeat(60));
  console.log('\n🧪 Test 3: Transfer Booking Confirmation Email');
  console.log('─'.repeat(60));

  const transferEmailHtml = generateTransferBookingEmail({
    guestName: 'Jane Doe',
    referenceNumber: 'TRF-20250610-001',
    fromLocation: 'Istanbul Airport (IST)',
    toLocation: 'Sultanahmet Hotels',
    transferDate: new Date('2025-06-10'),
    transferTime: '14:30',
    numberOfPassengers: 3,
    vehicleType: 'Standard Sedan',
    totalPrice: 45,
    flightNumber: 'TK1234',
    specialRequests: 'Baby seat required'
  });

  const transferTest = await sendEmail({
    to: 'customer@example.com',
    subject: 'Transfer Booking Confirmed - Funny Tourism',
    html: transferEmailHtml
  });

  console.log('Result:', transferTest);

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary:');
  console.log('─'.repeat(60));

  const allPassed = simpleTest.success && bookingTest.success && transferTest.success;

  if (allPassed) {
    console.log('✅ All tests passed!');
    if (process.env.BREVO_API_KEY) {
      console.log('✅ Emails were sent successfully via Brevo API');
    } else {
      console.log('⚠️  Emails were logged only (BREVO_API_KEY not configured)');
    }
  } else {
    console.log('❌ Some tests failed - check the errors above');
  }

  console.log('\n' + '='.repeat(60));
}

// Run the test
testEmailSystem()
  .then(() => {
    console.log('\n✨ Email test completed\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  });
