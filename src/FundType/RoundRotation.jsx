import { FaArrowLeft, FaDownload } from "react-icons/fa";

export default function RoundRotation() {
  return (
    <div className="p-6 min-h-screen">
      {/* Back */}
      <button className="flex items-center text-sm text-indigo-600 mb-3">
        <FaArrowLeft className="mr-1" /> Back to Group Details
      </button>

      {/* Title */}
      <h1 className="text-xl font-semibold">Round 3 Overview</h1>
      <p className="text-sm text-gray-500 mb-6">Royal Savings Group</p>

      {/* Winner Summary */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-semibold mb-4">Winner Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Winner Name</p>
            <p className="font-semibold">Amit Patel</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
              Completed
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Settlement Date: 2024-03-20
            </p>
          </div>

          <SummaryItem label="Winning Bid" value="₹7,800" />
          <SummaryItem label="Total Fund" value="₹32,000" />
          <SummaryItem label="Dividend" value="₹4,800" />
          <SummaryItem label="Commission" value="₹800" />
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bidding Summary */}
        <div className="bg-white rounded-xl border p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Bidding Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Stat label="Total Bids" value="18" />
            <Stat label="Average Bid" value="₹11,200" />
            <Stat label="Lowest Bid" value="₹7,800" color="text-green-600" />
            <Stat label="Highest Bid" value="₹15,500" color="text-red-500" />
          </div>

          {/* Chart Placeholder */}
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Line Chart
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Start Time: 10:00 AM</span>
            <span>End Time: 11:30 AM</span>
          </div>
        </div>

        {/* Contribution Status */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4">Contribution Status</h3>

          {/* Circle */}
          <div className="flex justify-center mb-4">
            <div className="w-28 h-28 rounded-full border-8 border-green-500 border-r-yellow-400" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-green-500 text-white rounded-lg p-3 text-center">
              <p className="text-xs">Paid</p>
              <p className="font-semibold">₹28,000</p>
            </div>
            <div className="flex-1 bg-yellow-400 text-white rounded-lg p-3 text-center">
              <p className="text-xs">Pending</p>
              <p className="font-semibold">₹4,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bid History */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-semibold mb-4">Bid History</h3>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2 text-left">Rank</th>
              <th>Member</th>
              <th>Bid Amount</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-yellow-100">
              <td className="py-2">1</td>
              <td>Amit Patel</td>
              <td>₹7,800</td>
              <td>11:28 AM</td>
              <td>
                <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                  Winner
                </span>
              </td>
            </tr>
            <BidRow
              rank="2"
              name="Rajesh Kumar"
              amount="₹8,200"
              time="11:25 AM"
            />
            <BidRow
              rank="3"
              name="Priya Sharma"
              amount="₹9,500"
              time="11:20 AM"
            />
            <BidRow
              rank="4"
              name="Vikram Singh"
              amount="₹10,000"
              time="11:15 AM"
            />
            <BidRow
              rank="5"
              name="Sneha Reddy"
              amount="₹11,200"
              time="11:10 AM"
            />
          </tbody>
        </table>
      </div>

      {/* Transaction Details */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-semibold mb-4">Transaction Details</h3>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2 text-left">Member</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <TransactionRow name="Rajesh Kumar" status="Paid" />
            <TransactionRow name="Priya Sharma" status="Paid" />
            <TransactionRow name="Amit Patel" status="Pending" />
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button label="Download Round Report" />
        <Button label="Download All Receipts" />
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const Stat = ({ label, value, color = "text-gray-900" }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`font-semibold ${color}`}>{value}</p>
  </div>
);

const BidRow = ({ rank, name, amount, time }) => (
  <tr className="border-b last:border-0">
    <td className="py-2">{rank}</td>
    <td>{name}</td>
    <td>{amount}</td>
    <td>{time}</td>
    <td></td>
  </tr>
);

const TransactionRow = ({ name, status }) => (
  <tr className="border-b last:border-0">
    <td className="py-2">{name}</td>
    <td>₹32,000</td>
    <td>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          status === "Paid"
            ? "bg-green-100 text-green-600"
            : "bg-yellow-100 text-yellow-600"
        }`}>
        {status}
      </span>
    </td>
    <td>2024-03-16</td>
    <td className="text-indigo-600 cursor-pointer">View Details</td>
  </tr>
);

const Button = ({ label }) => (
  <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
    <FaDownload /> {label}
  </button>
);
