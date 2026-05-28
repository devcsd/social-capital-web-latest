import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import LayoutDrawer from "../pages/AdminPanelLayout";
import localforage from "localforage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can return a loading indicator here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Clear local storage if the user is not authenticated
    localforage.clear();
    return <Navigate to="/" />; // Redirect to login page if not authenticated
  }

  return <LayoutDrawer>{children}</LayoutDrawer>;
};

export default ProtectedRoute;
