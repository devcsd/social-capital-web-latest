import { FaApple } from "react-icons/fa6";
import { FaGooglePlay } from "react-icons/fa";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.socialcapital";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/social-capital/id6748279308";

const SIZES = {
  md: {
    button: "px-6 py-3 rounded-[15px] gap-2.5 text-lg",
    icon: "text-2xl",
  },
  sm: {
    button: "px-4 py-2 rounded-xl gap-2 text-sm",
    icon: "text-lg",
  },
};

const StoreButtons = ({ size = "md", className = "" }) => {
  const s = SIZES[size];
  const base = `inline-flex items-center ${s.button} font-inter font-semibold transition-all duration-200 hover:-translate-y-0.5`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className={`${base} bg-black text-white hover:bg-white hover:text-black`}>
        <FaApple className={s.icon} />
        App Store
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className={`${base} bg-secondary text-black hover:bg-white`}>
        <FaGooglePlay className={s.icon} />
        Google Play
      </a>
    </div>
  );
};

export default StoreButtons;
