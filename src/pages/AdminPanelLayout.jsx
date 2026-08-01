import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaHome,
  FaCog,
  FaUser,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";
import { matchPath } from "react-router-dom";
import { SiCashapp } from "react-icons/si";
import localforage from "localforage";
import { PiSpinnerBallDuotone } from "react-icons/pi";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FaListCheck } from "react-icons/fa6";
import { IoMdMegaphone } from "react-icons/io";
import { MdHelpOutline } from "react-icons/md";
import { Layout, Menu, Button, Typography, Drawer } from "antd";
import { RiAuctionFill } from "react-icons/ri";
import { useAuth } from "../Auth/AuthContext";

import "./layout.css";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const pathKeyMap = {
  "/dashboard": "Dashboard",
  "/adminPanel/GroupCategories": "Groups",
  "/adminPanel/Members": "Members",
  "/adminPanel/FundManager": "FundManager",
  "/adminPanel/FundManager/:managerId": "FundManager",
  "/adminPanel/ManagerGroupsDetails/:groupID": "FundManager",
  "/adminPanel/GroupsRound/:roundID": "FundManager",
  "/adminPanel/Auction": "Auction",
  "/adminPanel/AuctionRound/:roundID": "Auction",
  "/adminPanel/AuctionGroupDetails/:groupID": "Auction",
  "/adminPanel/Rotation": "Rotation",
  "/adminPanel/RotationRound/:roundID": "Rotation",
  "/adminPanel/RotationGroupDetails/:groupID":"Rotation",
  "/adminPanel/Boardcast": "Boardcast",
  "/adminPanel/supportEnquiry": "SupportEnquiry",
};

const menuItems = [
  {
    key: "Dashboard",
    label: "Dashboard",
    icon: <FaChartPie />,
    to: "/dashboard",
  },
  {
    key: "Groups",
    label: "Groups",
    icon: <FaUsers />,
    to: "/adminPanel/GroupCategories",
  },
  {
    key: "Members",
    label: "Members",
    icon: <FaUser />,
    to: "/adminPanel/Members",
  },
  {
    key: "FundManager",
    label: "Group Manager",
    icon: <LuBriefcaseBusiness />,
    to: "/adminPanel/FundManager",
  },
  {
    key: "Auction",
    label: "Auction",
    icon: <RiAuctionFill />,
    to: "/adminPanel/Auction",
  },
  {
    key: "Rotation",
    label: "Rotation",
    icon: <PiSpinnerBallDuotone />,
    to: "/adminPanel/Rotation",
  },
  // { key: "Predefined", label: "Predefined", icon: <FaListCheck /> },
  // { key: "Reports", label: "Reports", icon: <FaChartLine /> },
  {
    key: "Boardcast",
    label: "Boardcast",
    icon: <IoMdMegaphone />,
    to: "/adminPanel/Boardcast",
  },
  {
    key: "SupportEnquiry",
    label: "Support Enquiry",
    icon: <MdHelpOutline />,
    to: "/adminPanel/supportEnquiry",
  },
  // { key: "Settings", label: "Settings", icon: <FaCog /> },
  { key: "Logout", label: "Logout", icon: <FaSignOutAlt /> },
];

const LayoutDrawer = ({ children }) => {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutpopup, setLogoutPopup] = useState(false);
  useEffect(() => {
    const matchedKey =
      Object.keys(pathKeyMap).find((path) =>
        matchPath(path, location.pathname),
      ) || "/dashboard";

    setSelectedMenu(pathKeyMap[matchedKey]);
  }, [location.pathname]);

  useEffect(() => {
    const getUser = async () => {
      const user = await localforage.getItem("user");
      console.log("User data:", user);
    };

    getUser();
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setDrawerOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCollapse = (collapsed) => {
    setIsSidebarOpen(!collapsed);
  };

  const toggleSidebarBtn = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleMenuClick = async ({ key }) => {
    if (key === "Logout") {
      setLogoutPopup(true);
    } else {
      if (isMobile) setDrawerOpen(false);
    }
  };

  const renderMenuItems = (menuItems) => {
    return menuItems.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: renderMenuItems(item.children),
        };
      } else {
        return {
          key: item.key,
          icon: item.icon,
          label: item.to ? <Link to={item.to}>{item.label}</Link> : item.label,
        };
      }
    });
  };

  const MenuNode = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedMenu]}
      onClick={handleMenuClick}
      items={renderMenuItems(menuItems)}
      style={{
        height: "100%",
        borderRight: 0,
        background: "transparent",
        padding: "8px 10px",
      }}
      className="custom-menu bg-primary"
    />
  );

  const UserProfile = ({
    bgClass = "bg-white",
    textClass = "text-primary",
    avatarBgClass = "bg-white",
    avatarTextClass = "text-primary",
  }) => (
    <div className="flex items-center gap-3">
      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt="Admin"
          className={`
          w-10 h-10 rounded-full object-cover
          border-2 border-primary shadow-sm
          ring-2 ring-white/40
          ${avatarBgClass}
        `}
        />
      ) : (
        <div
          className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold
          border-2 border-primary shadow-sm ring-2 ring-white/40
          ${avatarBgClass} ${avatarTextClass}
        `}
        >
          {user?.profileName}
        </div>
      )}

      <span
        className={`
        text-sm font-semibold whitespace-nowrap tracking-wide
        ${textClass}
      `}
      >
        {user?.fullName}
      </span>
    </div>
  );

  return (
    <Layout
      className="no-scrollbar"
      style={{
        minHeight: "100vh",
        fontFamily: "sans-serif",
        overflowX: "hidden",
        background: "#F5F7FB",
      }}
    >
      {logoutpopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-fadeIn">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 ring-8 ring-red-50">
                <FaSignOutAlt className="text-3xl text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-800">
              Confirm Logout
            </h2>

            {/* Message */}
            <p className="mt-2 text-center text-sm text-gray-500 leading-relaxed">
              Are you sure you want to logout from your account?
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setLogoutPopup(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await logout();
                  navigate("/administrator");
                }}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Sider (hidden on mobile) */}
      {!isMobile && (
        <div>
          <Sider
            collapsed={!isSidebarOpen}
            onCollapse={handleCollapse}
            width={256}
            className="fixed bg-primary left-0 h-full"
            style={{
              boxShadow: "2px 0 12px rgba(1, 44, 114, 0.18)",
              background: "linear-gradient(180deg, #0154D8 0%, #013EA6 100%)",
              transition: "width 0.25s ease",
            }}
          >
            <div
              className="flex items-center justify-between p-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Button
                type="text"
                onClick={toggleSidebarBtn}
                icon={
                  <FaHome
                    className="text-secondary text-3xl transition-transform duration-200 hover:scale-110"
                    style={{ color: "#ffc404" }}
                  />
                }
              />
            </div>
            <div
              className="absolute bottom-0 left-4 flex items-center gap-2 p-4 cursor-pointer transition-opacity duration-150 hover:opacity-80"
              onClick={async () => {
                await logout();
                navigate("/administrator");
              }}
            >
              <SiCashapp size={32} className="text-white drop-shadow-sm" />
              {isSidebarOpen && (
                <Text style={{ color: "white", fontWeight: 600, fontSize: 16, letterSpacing: "0.02em" }}>
                  <span style={{ color: "white" }}>ocial</span>
                  <span style={{ color: "#ffc404" }}>Capital</span>
                </Text>
              )}
            </div>

            {MenuNode}
          </Sider>
          <div className="px-4 py-4 border-none absolute right-5 ">
            <div className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
              <UserProfile
                avatarBgClass="bg-primary"
                avatarTextClass="text-white"
                textClass="text-primary"
              />
            </div>
          </div>
        </div>
      )}
      {/* Desktop Top Header */}

      {/* Mobile header (shows hamburger) */}
      {isMobile && (
        <div
          className="w-full flex items-center justify-between p-3 bg-primary"
          style={{
            position: "fixed",
            zIndex: 1000,
            top: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(90deg, #0154D8 0%, #013EA6 100%)",
            boxShadow: "0 2px 10px rgba(1, 44, 114, 0.25)",
          }}
        >
          <Button
            type="text"
            onClick={() => setDrawerOpen(true)}
            icon={<FaHome style={{ color: "#ffc404", fontSize: 24 }} />}
          />
         
          <div className="scale-90">
            <UserProfile
              avatarBgClass="bg-white"
              avatarTextClass="text-primary"
              textClass="text-white"
            />
          </div>
        </div>
      )}

      {/* Drawer for mobile */}
      <Drawer
        placement="left"
        closable={true}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0, height: "100%" }}
        width={280}
        styles={{
          body: { background: "#0154D8", color: "white" },
          header: {
            background: "#0154D8",
            color: "white",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          },
        }}
      >
        <div className="bg-gradient-to-b from-primary to-[#012C72] h-full">
          {MenuNode}

          <div
            className="absolute bottom-0 left-2 flex items-center gap-2 p-4 cursor-pointer transition-opacity duration-150 hover:opacity-80"
            onClick={async () => {
              await logout();
              setDrawerOpen(false);
              navigate("/administrator");
            }}
          >
            <SiCashapp size={48} className="text-white h-8 w-8 drop-shadow-sm" />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16, letterSpacing: "0.02em" }}>
              <span style={{ color: "white" }}>ocial</span>
              <span style={{ color: "#ffc404" }}>Capital</span>
            </Text>
          </div>
        </div>
      </Drawer>

      {/* Main Content */}
      <Layout
        style={{
          marginLeft: !isMobile ? (isSidebarOpen ? 256 : 80) : 0,
          transition: "all 0.2s",
          background: "transparent",
        }}
      >
        {/* add top padding on mobile to account for fixed mobile header */}
        <Content
          style={{
            padding: 24,
            overflowY: "auto",
            paddingTop: isMobile ? 64 : 24,
          }}
          className={`flex-1 relative p-6 transition-all duration-300`}
        >
          <div
            className="rounded-2xl p-6 min-h-[calc(100vh-96px)]"
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutDrawer;