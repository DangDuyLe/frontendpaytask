import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import SupportedEcosystem from '@/components/SupportedEcosystem';
import KeyValue from '@/components/KeyValue';
import PopularCategories from '@/components/PopularCategories';
import HowItWorks from '@/components/HowItWorks';
import WhyChoose from '@/components/WhyChoose';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <SupportedEcosystem />
      <KeyValue />
      <PopularCategories />
      <HowItWorks />
      <WhyChoose />
      <CTASection />
      <Footer />
    </div>
  );
}


