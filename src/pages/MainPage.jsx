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
import YouCAnDoSection from "../components/YouCanDoSection"
import "../index.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Main() {
  const { groupId } = useParams();

  // /groups/:groupId → smooth scroll to the "Powered by the Social Capital App" section
  useEffect(() => {
    if (!groupId) return;
    const timer = setTimeout(() => {
      document
        .getElementById("platform")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => clearTimeout(timer);
  }, [groupId]);

  return (
    <div className="min-h-screen bg-primary scrollbar-hide">
      <Header />
      <HeroSection />
      <YouCAnDoSection/>
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
