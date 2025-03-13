import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (dispatch) => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });

      localStorage.removeItem("user"); // Clear localStorage
      dispatch(removeUser()); // Remove from Redux store
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            👨‍💻 DevTinder
          </Link>
        </div>
        <div className="flex-none gap-2">
          {user && (
            <div className="dropdown dropdown-end mx-5 flex items-center">
              <p className="px-4">Welcome, {user.firstName}</p>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="user photo" src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-gray-800 text-white rounded-box z-50 mt-3 w-52 p-2 shadow-xl"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <li className="hover:bg-gray-700 rounded p-2">
                  <Link to="/posts">Posts</Link>
                </li>
                <li className="hover:bg-gray-700 rounded p-2">
                  <Link to="/connections">Connections</Link>
                </li>
                <li className="hover:bg-gray-700 rounded p-2">
                  <Link to="/requests">Requests</Link>
                </li>
                <li className="hover:bg-gray-700 rounded p-2">
                  <Link to="/premium">Premium</Link>
                </li>
                <li className="hover:bg-gray-700 rounded p-2">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="hover:bg-gray-700 rounded p-2">
                  <Link to="/block/user">Block Users</Link>
                </li>
                {user && user.role === "admin" ? (
                  <li className="hover:bg-gray-700 rounded p-2">
                    <Link to="/admin">Admin</Link>
                  </li>
                ) : null}
                <li className="hover:bg-gray-700 rounded p-2">
                  <button onClick={() => handleLogout(dispatch, navigate)}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
