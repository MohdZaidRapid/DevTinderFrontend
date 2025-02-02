import React from "react";

const Blocked = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 text-lg">
          Your account has been <strong>deactivated</strong> by the admin.
        </p>
        <p className="text-gray-600 mt-2">
          Please contact support for more information.
        </p>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Blocked;
