import Logo from "../images/coin.svg";
import { LuFerrisWheel } from "react-icons/lu";
import { RiAuctionFill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";

export const fundTypeData = [
  {
    name: "Spin to Win",
    tagline: "Randomized Winner",
    description:
      "Join a group, contribute a fixed amount, and spin the wheel to win the entire pool.",
    icon: LuFerrisWheel,
    bgColor: "bg-green-500",
    decorative: false,
  },
  {
    name: "Smart Auction",
    tagline: "Lowest Bid Wins",
    description:
      "Bid the smallest amount you're willing to accept. Lowest bid wins the pooled fund.",
    icon: RiAuctionFill,
    bgColor: "bg-pink-500",
    decorative: false,
  },
  {
    name: "Advance Slot Booking",
    tagline: "Scheduled Payout",
    description:
      "Book your payout in advance. Great for planned expenses like weddings or school fees.",
    icon: FaCalendarAlt,
    bgColor: "bg-indigo-500",
    decorative: false,
  },
  { decorative: true, image: Logo },
];

export const featureData = [
  {
    icon: LuFerrisWheel,
    title: "Spin to Win",
    description:
      "Join a group, contribute a fixed amount, and spin the wheel for a chance to win the full pool. Exciting, fair, and completely transparent.",
  },
  {
    icon: RiAuctionFill,
    title: "Smart Auction",
    description:
      "Get the funds you need by bidding the lowest amount you're willing to accept. Lowest bidder wins the pot—everyone else earns a share.",
  },
  {
    icon: FaCalendarAlt,
    title: "Pre-Defined",
    description:
      "Plan ahead by reserving a payout slot for a future round. Perfect for weddings, school fees, or business needs.",
  },
];
