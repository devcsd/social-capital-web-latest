import { useState, useCallback, useEffect, useRef } from "react";
import { Row, Col, Card, Avatar, Tag, Badge, Space, Typography } from "antd";
import {
  CalendarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { currencyMeta } from "../utils/currencyMeta";
import ReactCountryFlag from "react-country-flag";
import EmptyState from "../AdminComponent/EmptyState";
import { getGroupByID } from "../api/api";
import { formatCurrency } from "../utils/formatCurrency";
import { getInitials } from "../utils/getInitials";
import { useNavigate, useParams } from "react-router-dom";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const { Text, Title } = Typography;

/* ---------------- GROUP CARD ---------------- */

const RoundCard = ({ round, index }) => {
  const isCompleted = round.status === "completed";
  const navigate = useNavigate();

  return (
    <Card
      className="rounded-2xl relative"
      bodyStyle={{ padding: 24 }}
      onClick={() => navigate(`/adminPanel/GroupsRound/${round.id}`)}
    >
      {/* Round Header */}
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="m-0">
          Round {index + 1}
        </Title>

        <Tag
          className={`rounded-full px-4 py-1 text-sm font-semibold border-0 shadow-sm ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isCompleted ? "Completed" : "Upcoming"}
        </Tag>
      </div>

      {/* Date */}
      <Card className="bg-indigo-50 rounded-xl mb-4" bordered={false}>
        <Space>
          <CalendarOutlined className="text-primary" />
          <div>
            <Text type="secondary">Group Date</Text>
            <br />
            <Text strong>
              {round.date
                ? new Date(round.date).toLocaleDateString()
                : "Not Scheduled"}
            </Text>
          </div>
        </Space>
      </Card>

      {/* Winner */}
      <div
        className={`p-6 rounded-2xl mb-4 border overflow-hidden relative shadow-md ${
          isCompleted
            ? "bg-gradient-to-r from-emerald-500 to-green-600 border-white/20 text-white"
            : "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-700"
        }`}
      >
        {/* Glow Effect */}
        {isCompleted && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        )}

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          {isCompleted ? (
            round?.winnerImage ? (
              <img
                src={round.winnerImage}
                alt="Winner"
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border-4 border-white flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {round?.profileName || "W"}
              </div>
            )
          ) : (
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
              <TrophyOutlined className="text-3xl text-[#11B981]" />
            </div>
          )}

          {/* Content */}
          <div>
            <p
              className={`text-sm font-medium ${
                isCompleted ? "text-white/80" : "text-gray-500"
              }`}
            >
              {isCompleted ? "Round Winner" : "Winner Status"}
            </p>

            <h3 className="text-xl font-bold mt-1">
              {isCompleted && round?.winnerName
                ? round.winnerName
                : "This round is not completed "}
            </h3>
          </div>
        </div>
      </div>

      {/* Settlement */}
      <div className="bg-[#FFC600] p-6 rounded-xl" bordered={false}>
        <Text type="secondary">Payout Amount</Text>
        <h1 level={5} className="m-0 font-bold text-2xl text-black">
          {formatCurrency(round.currencyLabel, round.payoutAmount)}
        </h1>
      </div>
      <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition mt-5">
        View Details
      </button>
    </Card>
  );
};

const GroupHeaderSkeleton = () => (
  <div className="rounded-2xl mb-8 bg-white p-6 animate-pulse">
    <div className="h-8 w-1/3 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-4" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-xl bg-gray-200" />
      ))}
    </div>
  </div>
);

const RoundCardSkeleton = () => (
  <div className="rounded-2xl bg-white p-6 shadow animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-6 w-24 bg-gray-200 rounded" />
      <div className="h-6 w-20 bg-gray-200 rounded-full" />
    </div>

    <div className="h-20 bg-gray-200 rounded-xl mb-4" />
    <div className="h-20 bg-gray-300 rounded-xl mb-4" />
    <div className="h-16 bg-gray-200 rounded-xl mb-4" />

    <div className="h-12 bg-gray-300 rounded-xl mt-4" />
  </div>
);

/* ---------------- PAGE ---------------- */

export default function FundManagerGroupRound() {
  const canGoBackRef = useRef(false);
  const { groupID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [managerId, setManagerID] = useState("");
  const [rounds, SetRounds] = useState([]);
  const [group, setGroup] = useState(null);
  const [chartData, setChartData] = useState([]);

  const chartJsData = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        label: "Payout Amount",
        data: chartData.map((item) => item.payout),
        borderColor: "#3f51b5",
        backgroundColor: "rgba(63, 81, 181, 0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹ ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹ ${value}`,
        },
      },
    },
  };

  const fetchFundManagerGroupsRound = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGroupByID(groupID);
      const Data = response.data.data;
      setGroup(Data);
      SetRounds(Data.rounds || []);
      setManagerID(group.groupData.fund_manager_id);
    } catch (error) {
      console.error("Error fetching group:", error);
    } finally {
      setLoading(false);
    }
  }, [groupID]);

  useEffect(() => {
    console.log(groupID);
    fetchFundManagerGroupsRound();
  }, [fetchFundManagerGroupsRound]);

  useEffect(() => {
    if (!rounds.length) return;

    const formattedChartData = rounds.map((r, index) => ({
      label: `Round ${index + 1}`,
      payout: r.payoutAmount ?? 0,
    }));

    setChartData(formattedChartData);
  }, [rounds]);

  useEffect(() => {
    console.log("====", rounds);
    console.log("group", group);
    console.log("ManagerID", managerId);
  }, [rounds]);

  useEffect(() => {
    canGoBackRef.current = window.history.state && window.history.state.idx > 0;
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Back */}
      <button
        disabled={!group}
        onClick={() =>
          navigate(`/adminPanel/FundManager/${group.groupData.fund_manager_id}`)
        }
        className="flex items-center gap-2 text-primary mb-4 cursor-pointer"
      >
        <ArrowLeftOutlined />
        <Text strong>Back to Groups</Text>
      </button>
      {/* <pre>Groups : {JSON.stringify(group, null, 2)}</pre> */}

      {loading ? (
        <GroupHeaderSkeleton />
      ) : (
        <Card className="rounded-2xl mb-8" bodyStyle={{ padding: 24 }}>
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              {/* Left: Group Info */}
              <div>
                <Title level={2} className="mb-1">
                  {group?.groupName}
                </Title>
                <Text type="secondary">{group?.transactionType}</Text>
              </div>

              {/* Right: Group Type + Flag */}
              <div className="flex items-center gap-3">
                <Badge>{group?.groupType}</Badge>

                {currencyMeta?.[group?.currencyLabel]?.flag && (
                  <ReactCountryFlag
                    svg
                    countryCode={currencyMeta[group.currencyLabel].flag}
                    style={{ fontSize: "2em" }}
                  />
                )}
              </div>
            </div>

            {/* Stats */}
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Card className="rounded-xl bg-indigo-50">
                  <Text>Total Rounds</Text>
                  <h1 level={3} className="text-primary text-3xl font-bold">
                    {rounds.length}
                  </h1>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <div className="rounded-xl bg-[#FFC600] text-white p-6">
                  <Text className="text-black">Total Group Value</Text>
                  <h1 level={3} className="text-black text-3xl font-bold">
                    {formatCurrency(group?.currencyLabel, group?.totalFund)}
                  </h1>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="rounded-xl bg-[#11B981] text-white p-6">
                  <Text className="text-white">Completed Rounds</Text>
                  <h1 level={3} className="text-white text-3xl font-bold">
                    {group?.completedRoundCount}
                  </h1>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      )}
      <Row gutter={[24, 24]}>
        {loading ? (
          [...Array(6)].map((_, index) => (
            <Col xs={24} md={12} xl={8} key={index}>
              <RoundCardSkeleton />
            </Col>
          ))
        ) : rounds.length === 0 ? (
          <Col span={24}>
            <EmptyState
              message="No rounds available"
              subtitle="Rounds will appear once they are created"
            />
          </Col>
        ) : (
          [...rounds]
            .sort((a, b) => {
              const roundA = Number(a.round.split("_")[1]);
              const roundB = Number(b.round.split("_")[1]);

              return roundA - roundB;
            })
            .map((round, index) => (
              <Col xs={24} md={12} xl={8} key={round.id}>
                <RoundCard round={round} index={index} />
              </Col>
            ))
        )}
      </Row>
      {console.log("Round data", rounds)}

      <div className="h-[300px] mt-8">
        {loading ? (
          <div className="h-full w-full rounded-xl bg-gray-200 animate-pulse" />
        ) : rounds.length ? (
          <Line data={chartJsData} options={chartOptions} />
        ) : null}
      </div>
    </div>
  );
}
