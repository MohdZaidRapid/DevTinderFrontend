import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.user));
      return navigate("/");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      return navigate("/profile");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center my-10 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen">
      <div className="card bg-white shadow-xl w-80 max-h-[450px] rounded-xl p-4 transform hover:scale-105 transition-all">
        <div className="card-body p-4 overflow-y-auto">
          <h2 className="card-title text-center text-lg font-semibold text-indigo-600">
            {isLoginForm ? "Login" : "SignUp"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <label className="form-control w-full my-1">
                  <span className="label-text text-indigo-600 text-sm">First Name</span>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full bg-purple-50 focus:ring-2 focus:ring-purple-400 text-sm"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-1">
                  <span className="label-text text-indigo-600 text-sm">Last Name</span>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full bg-purple-50 focus:ring-2 focus:ring-purple-400 text-sm"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </>
            )}

            <label className="form-control w-full my-1">
              <span className="label-text text-indigo-600 text-sm">Email Id</span>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full bg-purple-50 focus:ring-2 focus:ring-purple-400 text-sm"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full my-1">
              <span className="label-text text-indigo-600 text-sm">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-purple-50 focus:ring-2 focus:ring-purple-400 text-sm"
              />
            </label>
          </div>
          <p className="text-red-500 text-center text-xs">{error}</p>
          <div className="card-actions justify-center my-2">
            <button
              className="btn bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white hover:from-pink-600 hover:via-purple-700 hover:to-indigo-800 text-sm"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "SignUp"}
            </button>
          </div>
          <p
            className="m-auto cursor-pointer text-center text-purple-600 hover:text-purple-800 text-xs py-2"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm
              ? "New User? Sign up here"
              : "Already a user? Log in here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
