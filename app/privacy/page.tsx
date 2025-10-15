export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Funny Tourism (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website funnytourism.com and use our services.
              </p>
              <p className="text-gray-700">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information You Provide</h3>
              <p className="text-gray-700 mb-4">We collect personal information that you voluntarily provide when:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Making a booking or reservation</li>
                <li>Registering for an account</li>
                <li>Subscribing to our newsletter</li>
                <li>Submitting inquiry forms</li>
                <li>Contacting us via email or phone</li>
              </ul>
              <p className="text-gray-700 mb-4">This information may include:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Name and contact information (email address, phone number, postal address)</li>
                <li>Passport information (for tour bookings)</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Travel preferences and special requests</li>
                <li>Emergency contact information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">When you visit our website, we automatically collect certain information, including:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Geographic location data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Process and manage your bookings and reservations</li>
                <li>Communicate with you about your bookings, including confirmations and updates</li>
                <li>Provide customer support and respond to your inquiries</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
                <li>Analyze website usage and trends</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Sharing Your Information</h2>
              <p className="text-gray-700 mb-4">We may share your information with:</p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We share information with third-party service providers who help us operate our business, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Hotels and accommodation providers</li>
                <li>Tour operators and guides</li>
                <li>Transportation companies</li>
                <li>Payment processors</li>
                <li>Email service providers</li>
                <li>Website hosting services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders, government agencies).
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Business Transfers</h3>
              <p className="text-gray-700 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Remember your preferences</li>
                <li>Understand how you use our website</li>
                <li>Improve website performance</li>
                <li>Deliver personalized content</li>
              </ul>
              <p className="text-gray-700">
                You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Secure Socket Layer (SSL) encryption</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage</li>
              </ul>
              <p className="text-gray-700">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law. After your booking is complete, we may retain certain information for legitimate business purposes, such as fraud prevention and legal compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Data Portability:</strong> Request transfer of your information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us at info@funnytourism.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and maintained on servers located outside your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Links</h2>
              <p className="text-gray-700">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
              <p className="text-gray-700">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this privacy policy or our data practices, please contact us:
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
          </div>
        </div>
      </div>
    </div>
  );
}
