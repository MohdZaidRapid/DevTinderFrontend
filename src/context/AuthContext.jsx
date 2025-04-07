import { createContext, useState, useEffect, useContext } from "react";
import axios from "../lib/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Fetch user failed:", err);
      localStorage.removeItem("accessToken"); // clear token if it's invalid
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("accessToken", token);
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : <div className="p-10 text-center">Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
