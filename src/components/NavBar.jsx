import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold">
          📚 Book Bazaar
        </Link>
        <Link to="/books" className="hover:underline">
          All Books
        </Link>
        {user && (
          <>
            <Link to="/my-books" className="hover:underline">
              My Books
            </Link>
            <Link
              to="/books/add"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded ml-2"
            >
              ➕ Add Book
            </Link>
          </>
        )}
      </div>

      <div>
        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
