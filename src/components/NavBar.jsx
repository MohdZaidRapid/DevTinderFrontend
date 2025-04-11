import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { Bell } from "lucide-react";
import axios from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notifications/unread-count");
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch unread notifications", err);
      }
    };

    fetchNotifications();

    socket.on("newNotification", () => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  const fetchDropdownNotifications = async () => {
    try {
      const res = await axios.get("/notifications/unread-senders");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch dropdown notifications", err);
    }
  };

  const handleBellClick = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) fetchDropdownNotifications();
  };

  const handleNotificationClick = async (chatLink) => {
    try {
      await axios.patch("/notifications/message/read", { chatLink });
      navigate(chatLink);
      setDropdownOpen(false);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`hover:text-blue-300 transition ${
        location.pathname === path ? "font-semibold text-blue-400" : ""
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/20 dark:bg-black/30 backdrop-blur-md text-white shadow-lg z-50 relative">
      {/* Left side */}
      <div className="flex items-center gap-6 text-base">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-100 hover:text-white transition"
        >
          📚 Book Bazaar
        </Link>
        {navLink("/books", "All Books")}
        {user && navLink("/my-books", "My Books")}
        {user && (
          <Link
            to="/books/add"
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm shadow"
          >
            ➕ Add Book
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 relative">
        {user && (
          <div ref={dropdownRef} className="relative">
            <button onClick={handleBellClick} className="relative">
              <Bell className="w-6 h-6 text-white hover:text-blue-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl overflow-hidden z-50"
                >
                  {notifications.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">
                      No new messages
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.senderId}
                        onClick={() => handleNotificationClick(n.chatLink)}
                        className="px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="font-semibold text-blue-700 dark:text-blue-400">
                          {n.name}{" "}
                          <span className="text-xs text-gray-500">
                            ({n.count})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {n.latestMessage}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full text-sm font-medium"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-full text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded-full text-sm font-medium"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
