import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="section-container text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Explore Turkey?
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Let us create the perfect Turkish adventure for you. Get a free quote today!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/inquiry" className="btn-secondary bg-white hover:bg-gray-100 text-primary-600 text-lg px-8 py-4">
            Get Free Quote
          </Link>
          <Link href="/packages" className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg">
            View All Packages
          </Link>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-sm">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No Hidden Fees
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Best Price Guarantee
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            24/7 Customer Support
          </div>
        </div>
      </div>
    </section>
  );
}
