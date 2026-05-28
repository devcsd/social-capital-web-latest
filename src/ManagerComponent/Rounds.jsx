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
      onClick={() => navigate(`/adminPanel/GroupsRound/${round.id}`)}>
      {/* Round Header */}
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="m-0">
          Round {index + 1}
        </Title>

        <Tag color={isCompleted ? "default" : "blue"} className="rounded-full">
          {isCompleted ? "Completed" : "Upcoming"}
        </Tag>
      </div>

      {/* Date */}
      <Card className="bg-indigo-50 rounded-xl mb-4" bordered={false}>
        <Space>
          <CalendarOutlined className="text-primary" />
          <div>
            <Text type="secondary">Fund Date</Text>
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
      <div className="bg-primary p-6 rounded-xl text-white mb-4 border border-white/20">
        <Space align="center">
          <Avatar
            size={48}
            src={isCompleted ? round?.winnerImage : null}
            className="bg-primary text-white font-semibold border border-white flex items-center content-center">
            {isCompleted && !round?.winnerImage && round?.profileName ? (
              round.profileName
            ) : !isCompleted ? (
              <TrophyOutlined className="text-2xl" />
            ) : null}
          </Avatar>

          <div>
            <Text className="text-white/80">Winner</Text>
            <br />
            <Text strong className="text-white">
              {isCompleted && round?.winnerName
                ? round.winnerName
                : "Yet to be decided"}
            </Text>
          </div>
        </Space>
      </div>

      {/* Settlement */}
      <div className="bg-secondary/50 p-6 rounded-xl" bordered={false}>
        <Text type="secondary">Payout Amount</Text>
        <h1 level={5} className="m-0">
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
        className="flex items-center gap-2 text-primary mb-4 cursor-pointer">
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
                  <h1 level={3} className="text-primary">
                    {rounds.length}
                  </h1>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <div className="rounded-xl bg-secondary/50 text-white p-6">
                  <Text className="text-black">Total Fund Value</Text>
                  <h1 level={3} className="text-black">
                    {formatCurrency(group?.currencyLabel, group?.totalFund)}
                  </h1>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="rounded-xl bg-primary text-white p-6">
                  <Text className="text-white">Completed Rounds</Text>
                  <h1 level={3} className="text-white">
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
          rounds.map((round, index) => (
            <Col xs={24} md={12} xl={8} key={round.id}>
              <RoundCard round={round} index={index} />
            </Col>
          ))
        )}
      </Row>

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
