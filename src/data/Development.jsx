import Screen1 from "../screenshots/splash.jpeg";
import Screen2 from "../screenshots/Dashboard.jpeg";
import Screen3 from "../screenshots/Share.jpeg";
import Screen4 from "../screenshots/InviteCard.jpeg";
import Screen5 from "../screenshots/Ivites.jpeg";
import Screen6 from "../screenshots/Groups.jpeg";
import Screen7 from "../screenshots/LiveRound.jpeg";
import Screen8 from "../screenshots/spinwheel.jpeg";
import Screen9 from "../screenshots/Bidding.jpeg";
import Screen10 from "../screenshots/Winnercard.jpeg";
import Screen11 from "../screenshots/Chat.jpeg";
import Screen12 from "../screenshots/Transcation.jpeg";
import Screen13 from "../screenshots/TransDet.jpeg";
import Screen14 from "../screenshots/Notification.jpeg";
import { FaTools, FaChartLine, FaRocket, FaHeadset } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { LuPuzzle } from "react-icons/lu";

export const phoneScreens = [
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
];

export const leftSteps = [
  {
    title: "Plan Your Purpose",
    desc: "Define your group's goal, purpose, and who can join.",
    icon: <GiBrain />,
  },
  {
    title: "Pick Your Group Type",
    desc: "Choose between Lottery, Auction, or Pre-defined contribution models.",
    icon: <LuPuzzle />,
  },
  {
    title: "Grow Together",
    desc: "Kickstart your Group and watch your social capital grow together.",
    icon: <FaChartLine />,
  },
];

export const rightSteps = [
  {
    title: "Refine Your Group",
    desc: "Fine-tune settings, rules, and participation flow.",
    icon: <FaTools />,
  },
  {
    title: "Get Support",
    desc: "We guide you through every step—setup to success.",
    icon: <FaHeadset />,
  },
  {
    title: "Go Live",
    desc: "Launch your Group and start building social capital.",
    icon: <FaRocket />,
  },
];
