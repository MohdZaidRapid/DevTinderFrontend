import React from "react";
import { useSelector } from "react-redux"; // Assuming Redux is used for user data
import { useNavigate } from "react-router-dom";

const WithRoleAuth = ({
  WrappedComponent,
  requiredRole = "admin",
  ...props
}) => {
  const user = useSelector((state) => state?.user); // Get user data from Redux

  const navigate = useNavigate();

  if (!user || user.role !== requiredRole) {
    // If the user doesn't have the required role, redirect or show an error
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  // If the user has the required role, render the WrappedComponent properly
  return <WrappedComponent {...props} />;
};

export default WithRoleAuth;
