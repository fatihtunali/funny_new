import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const tqaUrl = process.env.TQA_API_URL || 'https://travelquoteai.com';
    const tqaAuthToken = process.env.TQA_AUTH_TOKEN;

    console.log(`📧 Processing booking request for itinerary ${uuid}`);

    // First, get the itinerary details from TQA
    const itineraryResponse = await fetch(`${tqaUrl}/api/itinerary/${uuid}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!itineraryResponse.ok) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    const itinerary = await itineraryResponse.json();

    // Send booking request to TQA
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (tqaAuthToken) {
      headers['Authorization'] = `Bearer ${tqaAuthToken}`;
    }

    const bookingResponse = await fetch(
      `${tqaUrl}/api/itinerary/${uuid}/request-booking`,
      {
        method: 'POST',
        headers,
      }
    );

    if (!bookingResponse.ok) {
      console.error(`❌ TQA booking request failed: ${bookingResponse.status}`);
      return NextResponse.json(
        { error: 'Failed to submit booking request' },
        { status: bookingResponse.status }
      );
    }

    const result = await bookingResponse.json();

    // Send confirmation email to customer
    const destination = itinerary.city_nights.map((cn: {city: string; nights: number}) => cn.city).join(' & ');

    try {
      await sendEmail({
        to: itinerary.customer_email,
        subject: `Booking Request Received - ${destination} Tour`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Booking Request Received!</h1>
            </div>

            <div style="padding: 30px; background: #f9fafb;">
              <p style="font-size: 16px; color: #374151;">Dear ${itinerary.customer_name},</p>

              <p style="font-size: 16px; color: #374151;">
                Thank you for your interest in booking your <strong>${destination}</strong> adventure!
              </p>

              <div style="background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                <h3 style="color: #059669; margin-top: 0;">✅ Your Booking Request Details</h3>
                <ul style="color: #374151; line-height: 1.8;">
                  <li><strong>Destination:</strong> ${destination}</li>
                  <li><strong>Duration:</strong> ${itinerary.city_nights.reduce((sum: number, cn: {city: string; nights: number}) => sum + cn.nights, 0) + 1} Days</li>
                  <li><strong>Start Date:</strong> ${new Date(itinerary.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</li>
                  <li><strong>Travelers:</strong> ${itinerary.adults} Adult${itinerary.adults > 1 ? 's' : ''}${itinerary.children > 0 ? `, ${itinerary.children} Child${itinerary.children > 1 ? 'ren' : ''}` : ''}</li>
                  <li><strong>Total Price:</strong> €${parseFloat(itinerary.total_price).toLocaleString()}</li>
                </ul>
              </div>

              <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1d4ed8; margin-top: 0;">📋 What Happens Next?</h3>
                <ol style="color: #374151; line-height: 1.8;">
                  <li>Our team will review your itinerary within 24 hours</li>
                  <li>We'll confirm hotel availability and finalize details</li>
                  <li>You'll receive payment instructions and booking confirmation</li>
                  <li>Get ready for an amazing Turkey adventure!</li>
                </ol>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://funnytourism.com/itinerary/${uuid}"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  View Your Itinerary
                </a>
              </div>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  <strong>Need Help?</strong><br>
                  📧 Email: <a href="mailto:info@funnytourism.com" style="color: #3b82f6;">info@funnytourism.com</a><br>
                  📱 Phone: <a href="tel:+905325858786" style="color: #3b82f6;">+90 532 585 8786</a><br>
                  💬 WhatsApp: <a href="https://wa.me/905325858786" style="color: #25d366;">Chat with us</a>
                </p>
              </div>
            </div>

            <div style="background: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Funny Tourism - Licensed Turkish Tour Operator<br>
                TURSAB Member | Ministry of Tourism License
              </p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Confirmation email sent to ${itinerary.customer_email}`);
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to agency
    try {
      await sendEmail({
        to: 'info@funnytourism.com',
        subject: `🎉 New Booking Request - ${destination}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">🎉 New Booking Request!</h1>
            </div>

            <div style="padding: 30px; background: #f9fafb;">
              <p style="font-size: 16px; color: #374151;">
                A customer has requested to book their itinerary!
              </p>

              <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #059669; margin-top: 0;">Customer Information</h3>
                <ul style="color: #374151; line-height: 1.8;">
                  <li><strong>Name:</strong> ${itinerary.customer_name}</li>
                  <li><strong>Email:</strong> <a href="mailto:${itinerary.customer_email}">${itinerary.customer_email}</a></li>
                  ${itinerary.customer_phone ? `<li><strong>Phone:</strong> <a href="tel:${itinerary.customer_phone}">${itinerary.customer_phone}</a></li>` : ''}
                </ul>
              </div>

              <div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1d4ed8; margin-top: 0;">Trip Details</h3>
                <ul style="color: #374151; line-height: 1.8;">
                  <li><strong>Destination:</strong> ${destination}</li>
                  <li><strong>Duration:</strong> ${itinerary.city_nights.reduce((sum: number, cn: {city: string; nights: number}) => sum + cn.nights, 0) + 1} Days / ${itinerary.city_nights.reduce((sum: number, cn: {city: string; nights: number}) => sum + cn.nights, 0)} Nights</li>
                  <li><strong>Start Date:</strong> ${new Date(itinerary.start_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</li>
                  <li><strong>Travelers:</strong> ${itinerary.adults} Adult${itinerary.adults > 1 ? 's' : ''}${itinerary.children > 0 ? `, ${itinerary.children} Child${itinerary.children > 1 ? 'ren' : ''}` : ''}</li>
                  <li><strong>Hotel Category:</strong> ${itinerary.hotel_category}-Star</li>
                  <li><strong>Tour Type:</strong> ${itinerary.tour_type}</li>
                  <li><strong>Total Price:</strong> €${parseFloat(itinerary.total_price).toLocaleString()}</li>
                  <li><strong>Per Person:</strong> €${parseFloat(itinerary.price_per_person).toLocaleString()}</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://funnytourism.com/itinerary/${uuid}"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
                  View Full Itinerary
                </a>
                <a href="mailto:${itinerary.customer_email}"
                   style="display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Contact Customer
                </a>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="color: #92400e; margin: 0;">
                  <strong>⚡ Action Required:</strong> Please follow up with the customer within 24 hours to confirm availability and finalize the booking.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('✅ Notification email sent to agency');
    } catch (emailError) {
      console.error('❌ Failed to send notification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error processing booking request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process booking request' },
      { status: 500 }
    );
  }
}
