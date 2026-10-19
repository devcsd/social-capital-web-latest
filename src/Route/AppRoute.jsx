import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Main from "../pages/MainPage";
import TermsPage from "../pages/TermsPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import { AuthProvider } from "../Auth/AuthContext";

import NotFound from "./Redirect";
import Dashboard from "../Adminpages/Dashboard";
import MainGroup from "../Adminpages/MainGroup";
import Members from "../Adminpages/Member";
import Boardcast from "../Adminpages/Broadcast";
import { GroupDetails } from "../GroupComponent/GroupDetails";
import { GroupRounds } from "../GroupComponent/GroupRounds";
import FundManager from "../Adminpages/FundManager";
import FundManagerGroups from "../ManagerComponent/FundManagerGroups";
import FundManagerGroupRound from "../ManagerComponent/Rounds";
import GroupTranscation from "../ManagerComponent/GroupTranscation";
import AuctionOverview from "../FundType/AuctionGroups";
import RotationOverview from "../FundType/RotationGroups";
import AuctionGroupDetails from "../FundType/AuctionGroupDetails";
import RotationGroupDetails from "../FundType/RotationGroupDetails"
import RoundAuction from "../FundType/RoundAuction";
import RoundRotation from "../FundType/RoundRotation";
import SupportEnquiry from "../Adminpages/SupportEnquiry";
import GroupSettings from "../Adminpages/GroupSettings";
import { Toaster } from "react-hot-toast";

const AppRoute = () => (
  <AuthProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#0b1233",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow:
            "0 10px 25px -5px rgba(15, 23, 42, 0.10), 0 4px 10px -4px rgba(15, 23, 42, 0.06)",
        },
        success: {
          iconTheme: { primary: "#16a34a", secondary: "#ffffff" },
          style: { borderLeft: "4px solid #16a34a" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
          style: { borderLeft: "4px solid #ef4444" },
        },
        loading: {
          iconTheme: { primary: "#1e4fe5", secondary: "#e6ecff" },
          style: { borderLeft: "4px solid #1e4fe5" },
        },
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/group/:groupId" element={<Main />}></Route>
        <Route path="/terms&conditions" element={<TermsPage />}></Route>
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />}></Route>
        <Route path="/administrator" element={<LoginPage />}></Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Groups  */}

        <Route
          path="/adminPanel/GroupCategories"
          element={
            <ProtectedRoute>
              <MainGroup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminPanel/GroupCategories/:typeId"
          element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/GroupData/:groupId"
          element={
            <ProtectedRoute>
              <GroupRounds />
            </ProtectedRoute>
          }
        />

        {/* Group Settings  */}
        <Route
          path="/adminPanel/GroupSettings"
          element={
            <ProtectedRoute>
              <GroupSettings />
            </ProtectedRoute>
          }
        />

        {/* Members  */}
        <Route
          path="/adminPanel/Members"
          element={
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          }
        />

        {/* BoardCast  */}
        <Route
          path="/adminPanel/Boardcast"
          element={
            <ProtectedRoute>
              <Boardcast />
            </ProtectedRoute>
          }
        />

        {/* FundManager  */}
        <Route
          path="/adminPanel/FundManager"
          element={
            <ProtectedRoute>
              <FundManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/FundManager/:managerId"
          element={
            <ProtectedRoute>
              <FundManagerGroups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/ManagerGroupsDetails/:groupID"
          element={
            <ProtectedRoute>
              <FundManagerGroupRound />
            </ProtectedRoute>
          }
        />
        {/* Group Details */}
        <Route
          path="/adminPanel/GroupsRound/:roundID"
          element={
            <ProtectedRoute>
              <GroupTranscation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/Auction"
          element={
            <ProtectedRoute>
              <AuctionOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/Rotation"
          element={
            <ProtectedRoute>
              <RotationOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/AuctionGroupDetails/:groupID"
          element={
            <ProtectedRoute>
              <AuctionGroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/RotationGroupDetails/:groupID"
          element={
            <ProtectedRoute>
              <RotationGroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/AuctionRound/:roundID"
          element={
            <ProtectedRoute>
              <RoundAuction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPanel/RotationRound/:roundID"
          element={
            <ProtectedRoute>
              <RoundRotation />
            </ProtectedRoute>
          }
        />
        {/* Support Enquiry */}
        <Route
          path="/adminPanel/supportEnquiry"
          element={
            <ProtectedRoute>
              <SupportEnquiry />
            </ProtectedRoute>
          }
        />
        {/* Catch-all for invalid URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRoute;
