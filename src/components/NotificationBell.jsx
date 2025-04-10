// src/components/NotificationBell.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    socket.on("receiveMessage", (message) => {
      if (message.sender._id !== user._id) {
        setHasNew(true); // New notification!
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  const handleClick = () => {
    setHasNew(false);
    navigate("/notifications");
  };

  return (
    <button className="relative" onClick={handleClick} title="Notifications">
      <span className="text-2xl">🔔</span>
      {hasNew && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          1
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
