import { useNavigate } from "react-router-dom";
import Main from "./MainPage";
import LegalModal from "../components/LegalModal";
import { TERMS_CONTENT } from "../data/legal";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <>
      <Main />
      <LegalModal
        title={TERMS_CONTENT.title}
        subtitle={TERMS_CONTENT.subtitle}
        sections={TERMS_CONTENT.sections}
        onClose={() => navigate("/")}
      />
    </>
  );
}
