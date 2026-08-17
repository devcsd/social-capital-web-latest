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
import { Toaster } from "react-hot-toast";

const AppRoute = () => (
  <AuthProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1B1650",
          color: "#fff",
          border: "1px solid #fbbf24",
        },
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
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
