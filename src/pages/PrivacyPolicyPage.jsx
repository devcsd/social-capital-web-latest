import { useNavigate } from "react-router-dom";
import Main from "./MainPage";
import LegalModal from "../components/LegalModal";
import { PRIVACY_CONTENT } from "../data/legal";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <>
      <Main />
      <LegalModal
        title={PRIVACY_CONTENT.title}
        subtitle={PRIVACY_CONTENT.subtitle}
        sections={PRIVACY_CONTENT.sections}
        onClose={() => navigate("/")}
      />
    </>
  );
}
