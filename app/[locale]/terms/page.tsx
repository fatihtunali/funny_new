export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Funny Tourism. By accessing our website funnytourism.com and using our services, you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). Please read them carefully.
              </p>
              <p className="text-gray-700">
                If you do not agree to these Terms, you may not access or use our services. We reserve the right to modify these Terms at any time, and your continued use of our services constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. About Funny Tourism</h2>
              <p className="text-gray-700 mb-4">
                Funny Tourism is a licensed travel agency operating in Turkey under TURSAB License No. 7747. We specialize in providing tour packages, daily tours, transfers, and travel services throughout Turkey.
              </p>
              <p className="text-gray-700">
                Our services include but are not limited to: tour packages, daily excursions, airport transfers, hotel bookings, and customized travel itineraries.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Booking and Payment Terms</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Booking Process</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>All bookings must be made through our website, email, or authorized agents</li>
                <li>A booking is confirmed only upon receipt of payment and written confirmation from us</li>
                <li>Prices are subject to availability and may change without notice until booking is confirmed</li>
                <li>We reserve the right to refuse any booking at our discretion</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Payment</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Deposit: A non-refundable deposit (typically 30% of total cost) is required to confirm booking</li>
                <li>Full payment must be received at least 30 days before tour departure</li>
                <li>Bookings made less than 30 days before departure require immediate full payment</li>
                <li>Accepted payment methods: Bank transfer, credit card (via secure payment gateway), PayPal</li>
                <li>All prices are quoted in Euros (EUR) or US Dollars (USD) unless otherwise stated</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Price Inclusions and Exclusions</h3>
              <p className="text-gray-700 mb-4">Package prices typically include:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Accommodation as specified</li>
                <li>Meals as specified in itinerary</li>
                <li>Transportation as specified</li>
                <li>Guided tours and entrance fees as specified</li>
                <li>Airport transfers as specified</li>
              </ul>
              <p className="text-gray-700 mb-4">Prices typically DO NOT include:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>International flights to/from Turkey</li>
                <li>Turkey visa fees</li>
                <li>Travel insurance (strongly recommended)</li>
                <li>Personal expenses and tips</li>
                <li>Meals not specified in itinerary</li>
                <li>Optional activities not included in package</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cancellation and Refund Policy</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Cancellation by Customer</h3>
              <p className="text-gray-700 mb-4">Cancellation fees apply as follows:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>60+ days before departure:</strong> Deposit forfeited (typically 30%)</li>
                <li><strong>30-59 days before departure:</strong> 50% of total tour cost</li>
                <li><strong>15-29 days before departure:</strong> 75% of total tour cost</li>
                <li><strong>Less than 14 days before departure:</strong> 100% of total tour cost (no refund)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Note:</strong> Cancellation fees may be higher for peak season bookings (June-September) and special packages. Specific cancellation terms will be provided at time of booking.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Cancellation by Funny Tourism</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to cancel tours due to insufficient bookings, force majeure, or other circumstances beyond our control. In such cases:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Full refund of all payments made, OR</li>
                <li>Alternative tour dates or package offered</li>
                <li>We are not liable for additional costs (flights, visas, etc.) incurred by customer</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 No-Show Policy</h3>
              <p className="text-gray-700">
                Failure to show up for a confirmed tour without prior cancellation notice results in 100% forfeiture of all payments. No refunds or credits will be issued.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Changes and Modifications</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Changes by Customer</h3>
              <p className="text-gray-700 mb-4">
                Requests to modify confirmed bookings (dates, hotels, services) are subject to availability and may incur change fees plus any additional costs. Changes must be requested in writing at least 30 days before departure.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Changes by Funny Tourism</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to make minor changes to itineraries when necessary. Significant changes will be communicated promptly, and you will have the option to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Accept the modified itinerary, OR</li>
                <li>Cancel with full refund</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Travel Insurance</h2>
              <p className="text-gray-700 mb-4">
                <strong>Travel insurance is strongly recommended and, in some cases, mandatory.</strong> We recommend comprehensive coverage including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Trip cancellation and interruption</li>
                <li>Medical expenses and emergency evacuation</li>
                <li>Lost or delayed baggage</li>
                <li>Personal liability</li>
              </ul>
              <p className="text-gray-700">
                Funny Tourism is not responsible for any costs incurred due to lack of adequate insurance coverage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Travel Documents and Requirements</h2>
              <p className="text-gray-700 mb-4">It is your responsibility to ensure you have:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Valid passport (minimum 6 months validity from travel date)</li>
                <li>Required visas for Turkey and any transit countries</li>
                <li>Necessary health certificates or vaccinations</li>
                <li>Compliance with customs and immigration requirements</li>
              </ul>
              <p className="text-gray-700">
                We are not responsible if you are denied entry to Turkey or any country due to inadequate documentation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Health and Safety</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Medical Conditions</h3>
              <p className="text-gray-700 mb-4">
                You must inform us of any medical conditions, disabilities, or special requirements at the time of booking. We will make reasonable efforts to accommodate needs, but cannot guarantee suitability of all tours for all medical conditions.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Safety</h3>
              <p className="text-gray-700 mb-4">
                While we take all reasonable precautions, you participate in tours and activities at your own risk. You must:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Follow guide instructions and safety warnings</li>
                <li>Take reasonable care for your own safety and belongings</li>
                <li>Notify guides immediately of any concerns or incidents</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Liability and Limitations</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Our Liability</h3>
              <p className="text-gray-700 mb-4">
                Funny Tourism acts as an intermediary between you and third-party service providers (hotels, transport companies, restaurants). We:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Carefully select reputable service providers</li>
                <li>Are responsible for arranging services as described</li>
                <li>Are NOT liable for acts, omissions, or negligence of third-party providers</li>
                <li>Are NOT liable for force majeure events (natural disasters, strikes, political unrest, pandemics, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                Our liability is limited to the total amount paid for your booking. We are not liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Indirect, consequential, or punitive damages</li>
                <li>Lost profits or opportunities</li>
                <li>Personal injury or property damage caused by third parties</li>
                <li>Delays, cancellations, or changes by airlines or other carriers</li>
                <li>Theft, loss, or damage to personal property</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Customer Conduct</h2>
              <p className="text-gray-700 mb-4">You agree to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Behave respectfully toward guides, service providers, and other travelers</li>
                <li>Follow Turkish laws and customs</li>
                <li>Not engage in illegal activities</li>
                <li>Not disturb or endanger other travelers</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to terminate services immediately if your conduct is deemed inappropriate, illegal, or disruptive, with no refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Complaints and Disputes</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.1 Complaints During Tour</h3>
              <p className="text-gray-700 mb-4">
                If you have complaints during your tour, notify your guide immediately so we can attempt to resolve the issue. Complaints raised after tour completion cannot be remedied retroactively.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.2 Post-Tour Complaints</h3>
              <p className="text-gray-700 mb-4">
                Written complaints must be submitted within 30 days of tour completion via email to info@funnytourism.com. We will investigate and respond within 30 business days.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.3 Dispute Resolution</h3>
              <p className="text-gray-700">
                Any disputes will be governed by Turkish law and subject to the exclusive jurisdiction of Istanbul courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on our website (text, images, logos, designs) is the property of Funny Tourism and protected by copyright laws. You may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Copy, reproduce, or distribute our content without permission</li>
                <li>Use our branding or trademarks without authorization</li>
                <li>Scrape or data mine our website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Force Majeure</h2>
              <p className="text-gray-700">
                We are not liable for failure to perform our obligations due to circumstances beyond our reasonable control, including but not limited to: natural disasters, war, terrorism, civil unrest, strikes, government actions, pandemics, or other force majeure events. In such cases, we will work with you to find alternative solutions but are not obligated to provide refunds beyond recovered costs from suppliers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Photography and Marketing</h2>
              <p className="text-gray-700">
                By participating in our tours, you consent to Funny Tourism using photographs or videos taken during tours for marketing purposes, unless you explicitly opt out in writing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Entire Agreement</h2>
              <p className="text-gray-700">
                These Terms, together with our Privacy Policy and any booking-specific terms provided, constitute the entire agreement between you and Funny Tourism regarding use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Funny Tourism</strong></p>
                <p className="text-gray-700 mb-2">Mehmet Akif Ersoy Mah Hanımeli Sok No 5/B</p>
                <p className="text-gray-700 mb-2">Uskudar - Istanbul, Turkey</p>
                <p className="text-gray-700 mb-2">Email: <a href="mailto:info@funnytourism.com" className="text-primary-600 hover:underline">info@funnytourism.com</a></p>
                <p className="text-gray-700 mb-2">WhatsApp: <a href="https://wa.me/905395025310" className="text-primary-600 hover:underline">+90 539 502 53 10</a></p>
                <p className="text-gray-700">TURSAB License: 7747</p>
              </div>
            </section>

            <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-lg mt-8">
              <p className="text-primary-900 font-semibold mb-2">By making a booking with Funny Tourism, you acknowledge that you have read, understood, and agree to these Terms and Conditions.</p>
              <p className="text-primary-800 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
