import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

const BellNotification = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [senders, setSenders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    fetchUnreadSenders();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get("/notifications/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const fetchUnreadSenders = async () => {
    try {
      const res = await axios.get("/notifications/unread-senders");
      setSenders(res.data);
    } catch (err) {
      console.error("Failed to fetch sender list", err);
    }
  };

  const handleClick = (senderId) => {
    navigate(`/chat/${senderId}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="relative"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10 overflow-hidden">
          {senders.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No new messages</div>
          ) : (
            senders.map((s) => (
              <button
                key={s.senderId}
                onClick={() => handleClick(s.senderId)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                <div className="font-semibold">
                  {s.name} ({s.count})
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {s.latestMessage}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BellNotification;
