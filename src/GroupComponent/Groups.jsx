import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

import { GiDiamondRing, GiHeartEarrings, GiMagicHat } from "react-icons/gi";
import { LuHouse, LuBriefcaseBusiness } from "react-icons/lu";
import { MdOutlineSavings } from "react-icons/md";

import { GroupDetails } from "./GroupDetails";
import { getAllGroupCategoriesData } from "../api/api";

ChartJS.register(
  ArcElement, 
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Groups = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [responsedata, setResponseData] = useState(null);
  const [groupdata, setGroupData] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fundIcons = {
    "Gold Fund": <GiHeartEarrings />,
    "Custom Fund": <GiMagicHat />,
    "Home Fund": <LuHouse />,
    "Business Fund": <LuBriefcaseBusiness />,
    "Debt - Free": <MdOutlineSavings />,
    "Wedding Fund": <GiDiamondRing />,
  };

  const categories = groupdata.map((item) => ({
    name: item.fundType,
    groups: item.totalGroup,
    amount: item.totalFundAmount,
    groupTypeId: item.groupTypeId,
    icon: fundIcons[item.fundType],
  }));

  const SkeletonStat = () => (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded" />
      <div className="h-7 w-20 bg-gray-200 rounded" />
    </div>
  );

  const SkeletonCategory = () => (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-center gap-4 animate-pulse">
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />

        <div className="flex flex-col gap-2">
          <div className="w-28 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Right: Fund Section */}
      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
        <div className="w-16 h-4 bg-gray-200 rounded" />
        <div className="w-24 h-6 bg-gray-200 rounded" />
      </div>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllGroupCategoriesData();
        setResponseData(response.data);
        setGroupData(response?.data?.data?.groupInfoByType);
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      }
    };
    fetchData();
  }, []);

  if (selectedCategory) {
    return (
      <GroupDetails
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }
  const hasData = categories.length > 0;

  const colors = [
    "#36A2EB",
    "#FF6384",
    "#FF8A66",
    "#9966FF",
    "#00A86B",
    "#E91E63",
  ];

  const donutCartData = {
    labels: hasData ? categories.map((c) => c.name) : ["No Data"],
    datasets: [
      {
        label: "Groups",
        data: hasData ? categories.map((c) => c.groups) : [1],
        backgroundColor: hasData ? [...colors] : ["#ccc"],
        borderWidth: 2,
      },
    ],
  };

  const donutCartDataStyle = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const LineChartData = {
    labels: hasData ? categories.map((c) => c.name) : ["No Data"],
    datasets: [
      {
        label: "Total Amount",
        data: hasData ? categories.map((c) => c.amount) : [0],
        borderColor: "#021fb0",
        backgroundColor: hasData ? colors.map((c) => c + "33") : ["#ccc33"], // point fill behind line (optional)
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: hasData ? colors : ["#ccc"], // bubbles in colors array
        pointRadius: 5,
      },
    ],
  };

  const LineChartDataStyle = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { display: false }, grid: { display: false } },
      y: { ticks: { display: false }, grid: { display: false } },
    },
  };

  if (!responsedata) {
    return (
      <div className="min-h-screen p-6 space-y-6 ">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCategory />
            <SkeletonCategory />
            <SkeletonCategory />
            <SkeletonCategory />
            <SkeletonCategory />
            <SkeletonCategory />
          </div>
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-xl shadow h-[300px]">
            <div className="h-6 w-32 rounded bg-gray-200 animate-pulse mb-4" />
            <div className="flex-1 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="bg-white p-4 rounded-xl shadow h-[300px]">
            <div className="h-6 w-32 rounded bg-gray-200 animate-pulse mb-4" />
            <div className="flex-1 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">Group Management</h1>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Total Categories"
          value={responsedata.data.categoriesCount}
        />
        <StatCard label="Total Groups" value={responsedata.data.totalGroups} />
        <StatCard
          label="Total Fund Amount"
          value={responsedata.data.totalFundAmount.toLocaleString("en-IN")}
        />
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Fund Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() =>
                navigate(`/adminPanel/GroupCategories/${cat.groupTypeId}`)
              }
              className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:shadow-lg transition-shadow gap-3">
              <div className="flex items-center gap-3 text-primary text-2xl">
                {cat.icon}
                <div>
                  <h3 className="font-semibold text-gray-700">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.groups} Groups</p>
                </div>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                  Total Fund
                </span>
                <p className="text-lg font-bold text-primary">
                  {cat.amount ? cat.amount.toLocaleString("en-IN") : "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Groups" height={300}>
          <Doughnut data={donutCartData} options={donutCartDataStyle} />
        </ChartCard>
        <ChartCard title="Fund Amount" height={300}>
          <Line data={LineChartData} options={LineChartDataStyle} />
        </ChartCard>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 items-start">
    <p className="text-gray-500">{label}</p>
    <h2 className="text-2xl font-bold text-primary">{value}</h2>
  </div>
);

const ChartCard = ({ title, height, children }) => (
  <div
    className={`bg-white p-4 rounded-xl shadow h-[${height}px] flex flex-col`}>
    <h2 className="text-lg font-semibold text-primary mb-2">{title}</h2>
    <div className="flex-1 flex items-center justify-center">{children}</div>
  </div>
);

export default Groups;
