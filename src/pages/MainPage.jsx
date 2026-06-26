import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/WorkWithUsSection";
import BenefitHighlightSection from "../components/Benifit";
import DevelopmentSection from "../components/DevelopmentSection";
import Platform from "../components/platform";
import PayoutModels from "../components/CommunityFundPlatform";
import TrustAndSafetySection from "../components/SocialCapitalChartSection";
import Services from "../components/Services";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import Globalsection from "../components/Global"
import "../index.css";

function Main() {
  return (
    <div className="min-h-screen bg-[#1a237e] scrollbar-hide">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      {/* <BenefitHighlightSection /> */}
      <DevelopmentSection />
      <Platform />
      <PayoutModels />
      <Globalsection/>
      <TrustAndSafetySection />
      <Services />
      <Footer />
      <Chatbot />
    </div>
  );
}

export default Main;
