import { createContext, useContext, useState, useEffect } from "react";
import localforage from "localforage";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [user, setUser] = useState({
    profileImage: "",
    profileName: "",
    userId: "",
    emailId: "",
    name: "",
  });
  useEffect(() => {
    const checkAuth = async () => {
      const userInfo = await localforage.getItem("user");
      if (userInfo) {
        setIsAuthenticated(true);
        setUser({
          emailId: userInfo.emailId || "",
          firstName: userInfo.firstName || "",
          fullName: userInfo.fullName || "",
          profileImage: userInfo.profileImage || "",
          profileName: userInfo.profileName || "",
          userId: userInfo.userId || "",
        });
      }
      setLoading(false); // Stop loading once the check is done
    };
    checkAuth();
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await localforage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
