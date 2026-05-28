import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // or from context/auth logic

  if (!isAuthenticated) {
    return <Navigate to="/administrator" replace />;
  }

  return children;
}
