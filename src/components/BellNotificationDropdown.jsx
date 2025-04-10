import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      axios.get("/notifications/unread-senders").then((res) => {
        setNotifications(res.data);
      });
    }
  }, [open]);

  const handleClick = (chatLink) => {
    navigate(chatLink); // open the chat view
    setOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>🔔</button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No new messages</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.senderId}
                className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handleClick(n.chatLink)}
              >
                <strong>{n.name}</strong> ({n.count})
                <div className="text-sm text-gray-600 truncate">
                  {n.latestMessage}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
