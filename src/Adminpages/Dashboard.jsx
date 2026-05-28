import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaUserAlt, FaHandHoldingUsd } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { useAuth } from "../Auth/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
const primary = "#0152d3";
const secondary = "#ffc404";
function Counter({ end, duration = 2000, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    let endValue =
      typeof end === "number"
        ? end
        : parseInt(end.toString().replace(/\D/g, ""));
    let stepTime = Math.abs(Math.floor(duration / endValue));

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === endValue) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <h3 className="text-5xl font-extrabold text-white tracking-wide">
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </h3>
  );
}

const Dashboard = () => {
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Collections",
        data: [100, 200, 150, 300, 250, 450],
        borderColor: primary,
        backgroundColor: "rgba(53,41,177,0.15)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Payouts",
        data: [80, 160, 120, 250, 200, 400],
        borderColor: secondary,
        backgroundColor: "rgba(255,196,4,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: primary, font: { weight: "bold" } },
      },
      tooltip: {
        backgroundColor: primary,
        titleColor: "secondary",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: { ticks: { color: primary }, grid: { display: false } },
      y: {
        ticks: { color: primary },
        grid: { color: "rgba(53,41,177,0.1)" },
      },
    },
  };

  const { user } = useAuth();

  return (
    <div className="p-6 bg-gradient-to-br min-h-screen">
      {/* Topbar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-primary">📊 Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-primary to-primary text-white p-6 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <FaUserGroup size={50} className="opacity-80" />
            <Counter end={12} duration={800} />
          </div>
          <p className="text-lg mt-2 font-medium">Active Groups</p>
        </div>

        <div className="bg-gradient-to-r from-secondary to-[#f7b500] text-white p-6 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <FaUserAlt size={50} className="opacity-80" />
            <Counter end={248} duration={800} />
          </div>
          <p className="text-lg mt-2 font-medium">Users</p>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <FaHandHoldingUsd size={50} className="opacity-80" />
            <h3 className="text-4xl font-extrabold">₹ 5,40,000</h3>
          </div>
          <p className="text-lg mt-2 font-medium">Monthly Collections</p>
        </div>
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-primary">
            📈 Collections vs Payouts
          </h2>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-primary">
            ⚡ Recent Activity
          </h2>
          <ul className="space-y-4 text-gray-700 max-h-72 overflow-y-auto border-l-2 border-primary pl-4">
            <li>
              <span className="bg-secondary text-white px-2 py-1 rounded-md">
                Member #245
              </span>{" "}
              made a payment <span className="text-gray-500">· 2h ago</span>
            </li>
            <li>
              Auction conducted for{" "}
              <span className="bg-primary text-white px-2 py-1 rounded-md">
                Group C
              </span>{" "}
              <span className="text-gray-500">· 5h ago</span>
            </li>
            <li>
              <span className="bg-secondary text-white px-2 py-1 rounded-md">
                Group D
              </span>{" "}
              created <span className="text-gray-500">· 1d ago</span>
            </li>
            <li>
              <span className="bg-primary text-white px-2 py-1 rounded-md">
                Group B
              </span>{" "}
              chit updated <span className="text-gray-500">· 2d ago</span>
            </li>
            <li>
              Chit amount recorded for{" "}
              <span className="bg-secondary text-white px-2 py-1 rounded-md">
                Group A
              </span>{" "}
              <span className="text-gray-500">· 3d ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
