import {
  FaUsers,
  FaRegHandshake,
  FaChartPie,
  FaHandsHelping,
  FaHome,
  FaBriefcase,
} from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";

export const portfolioData = [
  {
    name: "Student Support Pool",
    growth: "2.12%",
    icon: FaHandsHelping,
    iconBg: "bg-blue-600",
    chartColor: "stroke-blue-400",
  },
  {
    name: "Home Dream Fund",
    growth: "2.05%",
    icon: FaHome,
    iconBg: "bg-yellow-500",
    chartColor: "stroke-yellow-400",
  },
  {
    name: "Wedding Circle Pool",
    growth: "3.27%",
    icon: GiDiamondRing,
    iconBg: "bg-rose-600",
    chartColor: "stroke-rose-400",
  },
  {
    name: "Business Growth Fund",
    growth: "2.12%",
    icon: FaBriefcase,
    iconBg: "bg-gray-500",
    chartColor: "stroke-gray-300",
  },
];

export const features = [
  { title: "Community Fund Creation", icon: FaUsers },
  { title: "Transparent Money Flow", icon: FaRegHandshake },
  { title: "Flexible Payout Models", icon: FaChartPie },
];
