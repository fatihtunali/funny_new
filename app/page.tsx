import Hero from "@/components/Hero";
import TrustIndicators from "@/components/TrustIndicators";
import HowItWorks from "@/components/HowItWorks";
import FeaturedPackages from "@/components/FeaturedPackages";
import WhyChooseUs from "@/components/WhyChooseUs";
import Destinations from "@/components/Destinations";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import CallToAction from "@/components/CallToAction";
import StructuredData, { generateOrganizationSchema } from "@/components/StructuredData";

export default function Home() {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <StructuredData data={organizationSchema} />
      {/* Hero Section with Search */}
      <Hero />

      {/* Trust Indicators - Build Credibility */}
      <TrustIndicators />

      {/* How It Works - Clear Process */}
      <HowItWorks />

      {/* Featured Packages - Core Offering */}
      <FeaturedPackages />

      {/* Why Choose Us - Value Proposition */}
      <WhyChooseUs />

      {/* Destinations - Inspire Travel */}
      <Destinations />

      {/* Social Proof - Testimonials */}
      <Testimonials />

      {/* Newsletter - Capture Leads */}
      <Newsletter />

      {/* Final CTA - Conversion */}
      <CallToAction />
    </>
  );
}
