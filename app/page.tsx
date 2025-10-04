import Hero from "@/components/Hero";
import FeaturedPackages from "@/components/FeaturedPackages";
import WhyChooseUs from "@/components/WhyChooseUs";
import Destinations from "@/components/Destinations";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import StructuredData, { generateOrganizationSchema } from "@/components/StructuredData";

export default function Home() {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <StructuredData data={organizationSchema} />
      <Hero />
      <WhyChooseUs />
      <FeaturedPackages />
      <Destinations />
      <Testimonials />
      <CallToAction />
    </>
  );
}
