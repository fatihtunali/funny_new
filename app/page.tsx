import Hero from "@/components/Hero";
import FeaturedPackages from "@/components/FeaturedPackages";
import Destinations from "@/components/Destinations";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedPackages />
      <Destinations />
      <Testimonials />
      <CallToAction />
    </>
  );
}
