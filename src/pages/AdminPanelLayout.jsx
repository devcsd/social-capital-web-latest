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
  FaBars,
} from "react-icons/fa";
import { matchPath } from "react-router-dom";
import { SiCashapp } from "react-icons/si";
import localforage from "localforage";
import { PiSpinnerBallDuotone } from "react-icons/pi";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FaListCheck } from "react-icons/fa6";
import { IoMdMegaphone } from "react-icons/io";
import { MdHelpOutline, MdHeadsetMic } from "react-icons/md";
import { Layout, Menu, Button, Typography, Drawer } from "antd";
import { RiAuctionFill } from "react-icons/ri";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiArrowRight,
} from "react-icons/hi";
import { useAuth } from "../Auth/AuthContext";

import "./layout.css";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const pathKeyMap = {
  "/dashboard": "Dashboard",
  "/adminPanel/GroupCategories": "Groups",
  "/adminPanel/GroupSettings": "GroupSettings",
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
    key: "GroupSettings",
    label: "Group Settings",
    icon: <FaCog />,
    to: "/adminPanel/GroupSettings",
  },
  {
    key: "Members",
    label: "Members",
    icon: <FaUser />,
    to: "/adminPanel/Members",
  },
  {
    key: "FundManager",
    label: "Group Admin",
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
    label: "Broadcast",
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

  const handleMenuClick = () => {
    if (isMobile) setDrawerOpen(false);
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
        borderRight: 0,
        background: "transparent",
        padding: "0 12px",
      }}
      className="custom-menu"
    />
  );

  const Brand = ({ showText = true }) => (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sc-gold-500 to-sc-gold-600 shadow-lg shadow-black/20">
        <SiCashapp size={22} className="text-sc-blue-900" />
      </div>
      {showText && (
        <div className="leading-tight min-w-0">
          <div className="text-[17px] font-bold tracking-wide text-white whitespace-nowrap">
            Social<span className="text-sc-gold-500">Capital</span>
          </div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
            Admin Panel
          </div>
        </div>
      )}
    </div>
  );

  const HelpCard = () => (
    <div className="px-3 pb-3">
      <div className="px-1 pt-3 text-[11px] leading-relaxed text-white/45">
        © {new Date().getFullYear()} SocialCapital
      
        v1.0.0
      </div>
    </div>
  );

  const LogoutButton = ({ collapsed = false }) => (
    <div className="px-3 pb-4 pt-3 border-t border-white/10">
      <button
        onClick={() => setLogoutPopup(true)}
        title="Logout"
        className={`group flex w-full items-center gap-3 rounded-xl py-2.5 text-[15px] font-medium text-white/75 transition-all duration-200 hover:bg-red-500/15 hover:text-red-300 ${
          collapsed ? "justify-center px-0" : "px-4"
        }`}
      >
        <FaSignOutAlt className="text-[17px] transition-transform duration-200 group-hover:-translate-x-0.5" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );

  const MenuSection = ({ collapsed = false }) => (
    <div className="flex-1 overflow-y-auto no-scrollbar py-4">
      {!collapsed && (
        <div className="px-7 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Main Menu
        </div>
      )}
      {MenuNode}
    </div>
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

      <div className="leading-tight">
        <div
          className={`
          text-sm font-semibold whitespace-nowrap
          ${textClass}
        `}
        >
          {user?.fullName}
        </div>
        <div className={`text-[11px] opacity-60 ${textClass}`}>Admin</div>
      </div>
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
            collapsedWidth={80}
            className="sidebar-sider"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              height: "100vh",
              zIndex: 100,
              background:
                "linear-gradient(180deg, #1b3fc4 0%, #0a1f6b 100%)",
              boxShadow: "4px 0 24px rgba(10, 31, 107, 0.25)",
            }}
          >
            <div className="flex h-full flex-col">
              <div
                className={`flex h-[72px] shrink-0 items-center border-b border-white/10 ${
                  isSidebarOpen ? "justify-between px-5" : "justify-center px-0"
                }`}
              >
                {isSidebarOpen ? (
                  <>
                    <Brand />
                    <button
                      onClick={toggleSidebarBtn}
                      title="Collapse sidebar"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <HiChevronDoubleLeft size={18} />
                    </button>
                  </>
                ) : (
                  <button onClick={toggleSidebarBtn} title="Expand sidebar">
                    <Brand showText={false} />
                  </button>
                )}
              </div>

              <MenuSection collapsed={!isSidebarOpen} />

              {!isSidebarOpen && (
                <button
                  onClick={toggleSidebarBtn}
                  title="Expand sidebar"
                  className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <HiChevronDoubleRight size={18} />
                </button>
              )}

              {isSidebarOpen && <HelpCard />}
              <LogoutButton collapsed={!isSidebarOpen} />
            </div>
          </Sider>
          <div className="px-4 py-4 border-none absolute right-5 ">
            <div className="rounded-2xl bg-white px-3 py-2 pr-5 shadow-sm ring-1 ring-slate-100">
              <UserProfile
                avatarBgClass="bg-primary"
                avatarTextClass="text-white"
                textClass="text-slate-900"
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
            background: "linear-gradient(90deg, #1b3fc4 0%, #0a1f6b 100%)",
            boxShadow: "0 2px 12px rgba(10, 31, 107, 0.3)",
          }}
        >
          <Button
            type="text"
            onClick={() => setDrawerOpen(true)}
            icon={<FaBars style={{ color: "#ffc72c", fontSize: 22 }} />}
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
        closable={false}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        styles={{
          body: { padding: 0, height: "100%", color: "white" },
        }}
      >
        <div
          className="flex h-full flex-col"
          style={{
            background: "linear-gradient(180deg, #1b3fc4 0%, #0a1f6b 100%)",
          }}
        >
          <div className="flex h-[72px] shrink-0 items-center px-5 border-b border-white/10">
            <Brand />
          </div>
          <MenuSection />
          <HelpCard />
          <LogoutButton />
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