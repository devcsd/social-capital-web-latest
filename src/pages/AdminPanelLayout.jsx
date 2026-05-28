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
  "/adminPanel/Auction": "Auction",
  "/adminPanel/Rotation": "Rotation",
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
    label: "FundManager",
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
  { key: "Predefined", label: "Predefined", icon: <FaListCheck /> },
  { key: "Reports", label: "Reports", icon: <FaChartLine /> },
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
  { key: "Settings", label: "Settings", icon: <FaCog /> },
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
  useEffect(() => {
    const matchedKey =
      Object.keys(pathKeyMap).find((path) =>
        location.pathname.startsWith(path),
      ) || "Dashboard";

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
      await logout();
      navigate("/administrator");
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
      style={{ height: "100%", borderRight: 0 }}
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
          border-2 border-primary
          ${avatarBgClass}
        `}
        />
      ) : (
        <div
          className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold
          border-2 border-primary
          ${avatarBgClass} ${avatarTextClass}
        `}>
          {user?.profileName}
        </div>
      )}

      <span
        className={`
        text-sm font-semibold whitespace-nowrap
        ${textClass}
      `}>
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
      }}>
      {/* Desktop Sider (hidden on mobile) */}
      {!isMobile && (
        <div>
          <Sider
            collapsed={!isSidebarOpen}
            onCollapse={handleCollapse}
            width={256}
            className="fixed bg-primary left-0 h-full">
            <div className="flex items-center justify-between p-4 border-b border-primary">
              <Button
                type="text"
                onClick={toggleSidebarBtn}
                icon={
                  <FaHome
                    className="text-secondary text-3xl"
                    style={{ color: "#ffc404" }}
                  />
                }
              />
              {isSidebarOpen && (
                <Title level={3} style={{ color: "white", margin: 0 }}>
                  Admin Panel
                </Title>
              )}
            </div>
            <div
              className="absolute bottom-0 left-4 flex items-center gap-2 p-4 cursor-pointer"
              onClick={async () => {
                await logout();
                navigate("/administrator");
              }}>
              <SiCashapp size={32} className="text-white" />
              {isSidebarOpen && (
                <Text style={{ color: "white", fontWeight: 600, fontSize: 16 }}>
                  <span style={{ color: "white" }}>ocial</span>
                  <span style={{ color: "#ffc404" }}>Capital</span>
                </Text>
              )}
            </div>

            {MenuNode}
          </Sider>
          <div className="px-4 py-4 border-none absolute right-5 ">
            <UserProfile
              avatarBgClass="bg-primary"
              avatarTextClass="text-white"
              textClass="text-primary"
            />
          </div>
        </div>
      )}
      {/* Desktop Top Header */}

      {/* Mobile header (shows hamburger) */}
      {isMobile && (
        <div
          className="w-full flex items-center justify-between p-3 border-b bg-primary"
          style={{
            position: "fixed",
            zIndex: 1000,
            top: 0,
            left: 0,
            right: 0,
          }}>
          <Button
            type="text"
            onClick={() => setDrawerOpen(true)}
            icon={<FaHome style={{ color: "#ffc404", fontSize: 24 }} />}
          />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Admin Panel
          </Title>
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
          },
        }}>
        <div className="bg-gradient-to-b from-primary to-[#012C72]">
          {MenuNode}

          <div
            className="absolute bottom-0 left-2 flex items-center gap-2 p-4 cursor-pointer"
            onClick={async () => {
              await logout();
              setDrawerOpen(false);
              navigate("/administrator");
            }}>
            <SiCashapp size={48} className="text-white h-8 w-8" />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
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
        }}>
        {/* add top padding on mobile to account for fixed mobile header */}
        <Content
          style={{
            padding: 24,
            overflowY: "auto",
            paddingTop: isMobile ? 64 : 24,
          }}
          className={`flex-1 relative p-6 transition-all duration-300`}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutDrawer;
