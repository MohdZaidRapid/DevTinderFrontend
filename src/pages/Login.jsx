import { useState } from "react";
import axios from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Reusable Input
const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full p-3 bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 
               placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 
               dark:border-neutral-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 
               focus:outline-none transition-all duration-200"
  />
);

const Login = () => {
  const [email, setEmail] = useState("mohdzaid130399@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/auth/login", { email, password });
      setSuccess(res.data.msg || "Logged in successfully!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-neutral-900 shadow-xl rounded-2xl transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
        🔐 Login
      </h2>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
        >
          Login
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
