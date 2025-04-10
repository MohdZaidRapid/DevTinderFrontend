import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import BookDetails from "../pages/BookDetails.jsx";
import Profile from "../pages/Profile.jsx";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyBooks from "../pages/MyBooks.jsx";
import EditBook from "../pages/EditBook.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AddBook from "../pages/AddBook.jsx";
import ChatPage from "../components/ChatPage.jsx";
import InboxPage from "../pages/InboxPage.jsx";
import NotificationsPage from "../pages/NotificationsPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/chat/:chatId" element={<ChatPage />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* ✅ Protected Routes wrapped correctly */}
      <Route
        path="/my-books"
        element={
          <ProtectedRoute>
            <MyBooks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/edit/:id"
        element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/add"
        element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
