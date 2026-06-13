import React from "react";
import {
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiAlertCircle,
  FiSend,
  FiMapPin,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const fundData = [
  { name: "Education", value: 35 },
  { name: "Gold", value: 25 },
  { name: "Wedding", value: 20 },
  { name: "Home", value: 15 },
  { name: "Custom", value: 5 },
];

const txnData = [
  { day: "1", amount: 120 },
  { day: "2", amount: 240 },
  { day: "3", amount: 180 },
  { day: "4", amount: 320 },
  { day: "5", amount: 260 },
  { day: "6", amount: 420 },
  { day: "7", amount: 380 },
  { day: "8", amount: 290 },
  { day: "9", amount: 310 },
  { day: "10", amount: 450 },
  { day: "11", amount: 390 },
  { day: "12", amount: 280 },
  { day: "13", amount: 340 },
  { day: "14", amount: 500 },
  { day: "15", amount: 470 },
  { day: "16", amount: 420 },
  { day: "17", amount: 360 },
  { day: "18", amount: 410 },
  { day: "19", amount: 530 },
  { day: "20", amount: 480 },
  { day: "21", amount: 450 },
  { day: "22", amount: 390 },
  { day: "23", amount: 520 },
  { day: "24", amount: 610 },
  { day: "25", amount: 570 },
  { day: "26", amount: 490 },
  { day: "27", amount: 430 },
  { day: "28", amount: 540 },
  { day: "29", amount: 620 },
  { day: "30", amount: 700 },
];

const colors = ["#2563EB", "#0EA5E9", "#22C55E", "#F59E0B", "#A855F7"];

const kpis = [
  { title: "Total Members", value: "15,284", icon: FiUsers },
  { title: "Fund Managers", value: "124", icon: FiUsers },
  { title: "Active Groups", value: "532", icon: FiLayers },
  { title: "Total Fund Value", value: "₹4.2 Cr", icon: FiDollarSign },
  { title: "Pending Txns", value: "1,248", icon: FiAlertCircle },
  { title: "Group Requests", value: "22", icon: FiSend },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Social Capital Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor groups, members, transactions and fund performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <Icon className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-slate-500 text-sm mt-4">{item.title}</h3>
              <p className="text-2xl font-bold text-slate-800">{item.value}</p>
            </div>
          );
        })}
      </div>


        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm mb-10">
          <h2 className="font-semibold text-lg mb-4">Transaction Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={txnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Group Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Active</span><b>532</b></div>
            <div className="flex justify-between"><span>Pending</span><b>44</b></div>
            <div className="flex justify-between"><span>Completed</span><b>182</b></div>
            <div className="flex justify-between"><span>Paused</span><b>18</b></div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Auction Overview</h2>
          <div className="space-y-2">
            <p>Active Auctions: 58</p>
            <p>Live Rounds: 12</p>
            <p>Today's Winners: 8</p>
            <p>Dividend Paid: ₹2.4L</p>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Rotation Overview</h2>
          <div className="space-y-2">
            <p>Active Groups: 74</p>
            <p>Today's Winners: 11</p>
            <p>Settlements: ₹5.8L</p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Pending Actions</h2>
          <div className="space-y-3">
            <div>22 Group Requests</div>
            <div>18 Paused Groups</div>
            <div>57 Pending Settlements</div>
            <div>124 Pending Transactions</div>
            <div>9 New Enquiries</div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div>10:20 AM - Ravi paid ₹5,000</div>
            <div>10:15 AM - Auction Winner Selected</div>
            <div>10:05 AM - New Group Request</div>
            <div>09:55 AM - Settlement Completed</div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Top Fund Managers</h2>
          <div className="space-y-3">
            <div className="border rounded-xl p-3">Raj Kumar - 22 Groups - ₹1.25L Earnings</div>
            <div className="border rounded-xl p-3">Arun - 18 Groups - ₹95K Earnings</div>
            <div className="border rounded-xl p-3">Priya - 15 Groups - ₹88K Earnings</div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FiMapPin /> Location Analytics
          </h2>
          <div className="space-y-3">
            <div>Chennai - 523 Members</div>
            <div>Coimbatore - 384 Members</div>
            <div>Madurai - 221 Members</div>
            <div>Trichy - 198 Members</div>
          </div>
        </div>
      </div>
    </div>
  );
}
