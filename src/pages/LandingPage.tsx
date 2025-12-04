import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import StatsSection from '../components/landing/StatsSection';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/LandingNavbar';
import VoiceChat from '../components/VoiceChat';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <StatsSection />
      <Footer />
      <VoiceChat />
    </div>
  );
};

export default LandingPage;
