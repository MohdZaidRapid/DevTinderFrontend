import { useState } from "react";
import axios from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

const Login = () => {
  const [email, setEmail] = useState("rayanmohd20@gmail.com");
  const [password, setPassword] = useState("zaid@123");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ ADD THIS

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/auth/login", { email, password });
      setSuccess(res.data.msg || "Logged in successfully!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.user, res.data.token);
      navigate("/"); // ✅ will now work
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded  text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default Login;
