import { FaCar, FaDesktop } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { GiDiamondRing } from "react-icons/gi";
import { AiFillAlert } from "react-icons/ai";
import {
  LuHouse,
  LuBriefcaseBusiness,
  LuGift,
  LuPartyPopper,
} from "react-icons/lu";
import { MdFlight } from "react-icons/md";
import { SlGraduation } from "react-icons/sl";
import { TbSettings } from "react-icons/tb";

export const FundPurpose = [
  {
    name: "Education",
    icon: SlGraduation,
    iconBg: "bg-blue-600",
    description: "Support tuition, coaching, or school-related expenses.",
  },
  {
    name: "Wedding",
    icon: GiDiamondRing,
    iconBg: "bg-pink-500",
    description: "Plan marriage costs or organize a group wedding gift.",
  },
  {
    name: "Home",
    icon: LuHouse,
    iconBg: "bg-green-600",
    description: "Raise funds for rent, repairs, or buying a new home.",
  },
  {
    name: "Business",
    icon: LuBriefcaseBusiness,
    iconBg: "bg-gray-700",
    description: "Start a venture or support a shared business goal.",
  },
  {
    name: "Travel",
    icon: MdFlight,
    iconBg: "bg-yellow-400",
    description: "Plan a group trip and split travel costs easily.",
  },
  {
    name: "Gift",
    icon: LuGift,
    iconBg: "bg-red-500",
    description: "Collect funds for a surprise gift or celebration.",
  },
  {
    name: "Car",
    icon: FaCar,
    iconBg: "bg-indigo-500",
    description: "Save for a new car, repairs, or regular servicing.",
  },
  {
    name: "Emergency",
    icon: AiFillAlert,
    iconBg: "bg-rose-600",
    description: "Quickly raise urgent help for health or crisis aid.",
  },
  {
    name: "Gadget",
    icon: FaDesktop,
    iconBg: "bg-cyan-500",
    description: "Pool cash for new tech or electronic purchases.",
  },
  {
    name: "Fitness",
    icon: IoMdFitness,
    iconBg: "bg-orange-500",
    description: "Cover gym fees, sports gear, or wellness needs.",
  },
  {
    name: "Festival",
    icon: LuPartyPopper,
    iconBg: "bg-purple-600",
    description: "Celebrate together by pooling festival expenses.",
  },
  {
    name: "Custom",
    icon: TbSettings,
    iconBg: "bg-slate-500",
    description: "Create a fund for anything you or your group want.",
  },
];
