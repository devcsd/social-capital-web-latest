import { useState, useCallback, useEffect } from "react";
import { Row, Col, Card, Avatar, Tag, Button, Space, Typography } from "antd";
import {
  CalendarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { currencyMeta } from "../utils/currencyMeta";
import { useNavigate, useParams } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { getFundManagerByID } from "../api/api";
import ManualPagination from "../AdminComponent/Pagination";
import EmptyState from "../AdminComponent/EmptyState";
import { formatCurrency } from "../utils/formatCurrency";
import { getInitials } from "../utils/getInitials";

function Price({ amount, currency }) {
  return <span>{formatCurrency(currency, amount)}</span>;
}

const { Text, Title } = Typography;

/* ---------------- GROUP CARD ---------------- */
const GroupCard = ({
  title,
  date,
  earned,
  winner,
  winnerImage,
  amount,
  groupId,
  currency,
  groupType,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/adminPanel/ManagerGroupsDetails/${groupId}`)}
      className="cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl transition p-5"
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
          <h5 className="text-sm text-primary bg-[#F6F5FF] p-1 px-4  rounded-2xl mb-4">
            {groupType}
          </h5>
        </div>
        <span>
          <ReactCountryFlag
            svg
            countryCode={currencyMeta[currency].flag}
            style={{ fontSize: "2em" }}
          />
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Upcoming Round */}
        <div className="rounded-xl bg-indigo-50 p-4 flex items-center gap-3">
          <CalendarOutlined className="text-primary text-lg" />
          <div>
            <p className="text-sm text-gray-500">Upcoming Round</p>
            <p className="font-semibold">{date}</p>
          </div>
        </div>

        {/* Manager Earned */}
        <div className="rounded-xl bg-[#FFC501] p-4">
          <p className="text-sm text-gray-600">Manager Earned</p>
          <p className="text-lg font-semibold">
            {formatCurrency(currency, earned)}
          </p>
        </div>

        {/* Previous Winner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-5 shadow-lg border border-emerald-400">
          {/* Background Glow */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            {winner ? (
              winnerImage ? (
                <img
                  src={winnerImage}
                  alt="Winner"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#FFC600] backdrop-blur flex items-center justify-center  text-white text-lg font-bold shadow-md">
                  {getInitials(winner)}
                </div>
              )
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-4 border-white text-white shadow-md">
                <TrophyOutlined className="text-3xl" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm text-emerald-100 font-medium tracking-wide uppercase">
                Previous Winner
              </p>

              <h3 className="text-xl font-bold text-white mt-1">
                {winner || "No Completed Round"}
              </h3>
            </div>
          </div>
        </div>

        {/* Settlement Amount */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Payout Amount</p>
          <p className="font-semibold text-primary text-base">
            {formatCurrency(currency, amount)}
          </p>
        </div>

        {/* Button */}
        <button
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          onClick={() => navigate(`/adminPanel/ManagerGroups/${groupId}`)}
        >
          View Rounds
        </button>
      </div>
    </div>
  );
};

const GroupSkeleton = () => (
  <div className="rounded-2xl bg-white shadow-md p-5 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-5 w-32 bg-gray-200 rounded"></div>
      <div className="h-6 w-10 bg-gray-200 rounded"></div>
    </div>

    <div className="space-y-4">
      <div className="h-6 w-24 bg-gray-200 rounded-full"></div>

      <div className="h-16 bg-gray-200 rounded-xl"></div>

      <div className="h-14 bg-gray-200 rounded-xl"></div>

      <div className="h-14 bg-gray-200 rounded-xl"></div>

      <div className="flex justify-between">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>

      <div className="h-12 bg-gray-300 rounded-xl"></div>
    </div>
  </div>
);

/* ---------------- PAGE ---------------- */

export default function FundManagerGroups() {
  const { managerId } = useParams();
  const pageSize = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [managerInfo, setManagerInfo] = useState(null);
  const [fundManagerGroups, setFundManagerGroups] = useState([]);

  const paginatedGroups = fundManagerGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const fetchFundManagerGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFundManagerByID(managerId);
      const managerData = response.data.data;

      setManagerInfo(managerData);
      setFundManagerGroups(managerData.data || []); // 👈 groups array
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  useEffect(() => {
    console.log(managerId);
    fetchFundManagerGroups();
  }, [fetchFundManagerGroups]);

  useEffect(() => {
    console.log("response", managerInfo);
  }, [managerInfo]);
  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Back */}
      <button
        onClick={() => navigate("/adminPanel/FundManager")}
        className="flex items-center gap-2 text-primary mb-4 cursor-pointer"
      >
        <ArrowLeftOutlined />
        <Text strong>Back to Group Managers</Text>
      </button>

      {/* <pre>Groups : {JSON.stringify(managerInfo, null, 2)}</pre> */}

      {/* Manager Header Card */}
      {managerInfo && (
        <Card
          style={{ borderRadius: 20 }}
          className="mb-8"
          bodyStyle={{ padding: 24 }}
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                src={managerInfo.fundManagerProfileImage || undefined}
                style={{
                  backgroundColor: managerInfo.fundManagerProfileImage
                    ? undefined
                    : "#3f51b5",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {!managerInfo.fundManagerProfileImage &&
                  getInitials(managerInfo.fundManagerName)}
              </Avatar>

              <div>
                <Title level={4} style={{ marginBottom: 4 }}>
                  Groups Managed by {managerInfo.fundManagerName}
                </Title>
                <Text type="secondary">
                  Total Earnings:{" "}
                  <Text strong style={{ color: "#3f51b5" }}>
                    {managerInfo.totalEarnings}
                  </Text>
                </Text>
              </div>
            </div>

            <div className="text-right">
              <Text type="secondary">Total Groups</Text>
              <Title level={3} style={{ margin: 0, color: "#3f51b5" }}>
                {managerInfo.totalManageGroup}
              </Title>
            </div>
          </div>
        </Card>
      )}

      {/* Groups Grid */}
      <Row gutter={[24, 24]}>
        {/* LOADING */}
        {loading &&
          Array.from({ length: pageSize }).map((_, index) => (
            <Col key={index} xs={24} sm={12} xl={8}>
              <GroupSkeleton />
            </Col>
          ))}

        {/* EMPTY */}
        {!loading && fundManagerGroups.length === 0 && (
          <Col span={24}>
            <EmptyState
              message="No Groups Found"
              subtitle="This Group manager has not created any groups yet."
            />
          </Col>
        )}

        {/* DATA */}
        {!loading &&
          paginatedGroups.map((group) => (
            <Col key={group.groupId} xs={24} sm={12} xl={8}>
              <GroupCard
                title={group.groupName}
                currency={group.currency}
                date={
                  group.upcomingRoundDate
                    ? new Date(group.upcomingRoundDate).toLocaleDateString()
                    : "Not Scheduled"
                }
                groupType={group.groupType}
                earned={group.managerEarningAmount}
                winner={group.previousRoundWinnerName}
                winnerImage={group.previousRoundWinnerImage}
                amount={group.previousRoundSettlementAmount}
                groupId={group.groupId}
              />
            </Col>
          ))}
      </Row>
      {!loading && fundManagerGroups.length > pageSize && (
        <ManualPagination
          total={fundManagerGroups.length}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
