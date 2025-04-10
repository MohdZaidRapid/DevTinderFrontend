import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { Bell } from "lucide-react";
import axios from "../lib/axios";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notifications/unread-count");
        console.log("🛎️ Res count:", res.data.count); // <== Add this
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
      await axios.patch("/notifications/message/read", { chatLink }); // custom endpoint
      navigate(chatLink);
      setDropdownOpen(false);
      setUnreadCount((prev) => Math.max(0, prev - 1)); // optional
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white relative">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold">
          📚 Book Bazaar
        </Link>
        <Link to="/books" className="hover:underline">
          All Books
        </Link>
        {user && (
          <>
            <Link to="/my-books" className="hover:underline">
              My Books
            </Link>
            <Link
              to="/books/add"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded ml-2"
            >
              ➕ Add Book
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="relative">
            <button onClick={handleBellClick}>
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black border rounded shadow-lg z-50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500">No new messages</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.senderId}
                      className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleNotificationClick(n.chatLink)}
                    >
                      <div className="font-bold">
                        {n.name} ({n.count})
                      </div>
                      <div className="text-sm text-green-600 truncate">
                        {n.latestMessage}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
