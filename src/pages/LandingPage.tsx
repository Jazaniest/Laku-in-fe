import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import ChatCs from '../components/ChatCs';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <StatsSection />
      <Footer />
      <ChatCs />
    </div>
  );
};

export default LandingPage;
