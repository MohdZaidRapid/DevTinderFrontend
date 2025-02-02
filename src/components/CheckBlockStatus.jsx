import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const CheckBlockStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutTimer, setLogoutTimer] = useState(30);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/check-auth`, {
          withCredentials: true,
        });

        if (response?.data?.isDeactivated) {
          setShowBanner(true);

          // Get the deactivatedAt time or fallback to localStorage
          const deactivatedAt = response.data.deactivatedAt
            ? new Date(response.data.deactivatedAt).getTime()
            : Number(localStorage.getItem("deactivatedAt")) || Date.now();

          // Store deactivatedAt in localStorage if not already set
          if (!localStorage.getItem("deactivatedAt")) {
            localStorage.setItem("deactivatedAt", deactivatedAt);
          }

          const now = Date.now();
          const timeElapsed = Math.floor((now - deactivatedAt) / 1000);
          const remainingTime = Math.max(30 - timeElapsed, 0);

          setLogoutTimer(remainingTime);

          const interval = setInterval(() => {
            setLogoutTimer((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                handleLogout();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkStatus();

    // Cleanup on unmount
    return () => {
      localStorage.removeItem("deactivatedAt");
    };
  }, [dispatch, navigate]);

  // 🚀 Logout API Call
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/blocked"); // Redirect to BlockedUser page
      localStorage.removeItem("deactivatedAt"); // Clear deactivation timestamp
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    showBanner && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in">
        <p className="font-semibold text-lg">🚫 You’ve been blocked by the admin!</p>
        <p className="text-sm">Logging out in {logoutTimer} seconds...</p>
      </div>
    )
  );
};

export default CheckBlockStatus;
