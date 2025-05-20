// /components/CTAButton :
import { useTranslation, Link } from "gatsby-plugin-react-i18next";

const CTAButton = () => {
  const { t } = useTranslation();
  const buttonText = t("cta.text").split("\n"); // Tekst splitsen op newline

  return (
    <Link
      to="/register"
      className="btn btn-primary mx-auto inline-flex w-fit flex-col items-center px-6 py-3"
    >
      <span>{buttonText[0]}</span> {/* Eerste regel */}
      <span className="text-sm text-gray-200">{buttonText[1]}</span> {/* Tweede regel kleiner */}
    </Link>
  );
};

export default CTAButton;
