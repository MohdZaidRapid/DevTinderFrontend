import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import CryptoJS from "crypto-js";

const EncryptedChat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [decryptedMessages, setDecryptedMessages] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/private/getMessages/${targetUserId}`,
          { withCredentials: true }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [targetUserId]);

  const encryptMessage = (message, password) => {
    const salt = CryptoJS.lib.WordArray.random(16);
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000,
      hasher: CryptoJS.algo.SHA256,
    });

    const encrypted = CryptoJS.AES.encrypt(message, key, { iv }).toString();

    return [
      salt.toString(CryptoJS.enc.Base64),
      iv.toString(CryptoJS.enc.Base64),
      encrypted,
    ].join(":");
  };

  const decryptMessage = async (encryptedText, index) => {
    if (!password.trim()) {
      alert("Enter password to decrypt the message.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/private/decryptMessage`, {
        encryptedText,
        password,
      });

      setDecryptedMessages((prev) => ({
        ...prev,
        [index]: response.data.decryptedText,
      }));
    } catch (error) {
      console.error("Decryption failed:", error.response?.data?.error);
      alert("Decryption failed. Check password.");
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !password.trim()) {
      alert("Please enter a message and password");
      return;
    }

    try {
      const encryptedText = encryptMessage(text, password);
      await axios.post(
        `${BASE_URL}/private/sendMessage`,
        { targetUserId, encryptedText },
        { withCredentials: true }
      );
      setMessages([...messages, { senderId: user._id, text: encryptedText }]);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-200 shadow-lg rounded-lg mt-10 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Encrypted Chat</h2>
      <input
        type="password"
        placeholder="Enter decryption password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
      />
      <div className="space-y-2 bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-3 border-b flex flex-col bg-gray-100 rounded-lg">
            {decryptedMessages[index] ? (
              <span className="text-green-600 font-medium">{decryptedMessages[index]}</span>
            ) : (
              <div>
                <p className="text-gray-500 italic">Encrypted Message</p>
                <button
                  onClick={() => decryptMessage(msg.text, index)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Decrypt
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default EncryptedChat;
