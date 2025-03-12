import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import appStore from "./utils/appStore";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import BlockedUser from "./components/BlockedUser";
import WithRoleAuth from "./components/WithRoleAuth";
import Example from "./components/Example";
import AdminDashboard from "./components/AdminDashboard";
import CheckBlockStatus from "./components/CheckBlockStatus";
import Blocked from "./components/Blocked";
import VideoCall from "./components/VideoCall";
import PostContainer from "./components/PostContainer";
import EncryptedChat from "./components/EncryptedChat";
import BuyPost from "./components/BuyPost"; // Added BuyPost Component
import OwnerPosts from "./components/OwnerPosts";

function SyncUserWithLocalStorage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(addUser(JSON.parse(storedUser))); // Restore user from localStorage
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}

function App() {
  return (
    <Provider store={appStore}>
      <SyncUserWithLocalStorage />
      <BrowserRouter basename="/">
        <CheckBlockStatus />
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/block/user" element={<BlockedUser />} />
            <Route path="/blocked" element={<Blocked />} />
            <Route path="/video/:targetUserId" element={<VideoCall />} />
            <Route path="/posts" element={<PostContainer />} />
            <Route path="/ownerposts" element={<OwnerPosts />} />
            <Route
              path="/encrypted-chat/:targetUserId"
              element={<EncryptedChat />}
            />
            <Route path="/buy-post/:postId" element={<BuyPost />} />{" "}
            {/* Added BuyPost Route */}
            {/* Admin Routes Protected by HOC */}
            <Route
              path="/example"
              element={
                <WithRoleAuth WrappedComponent={Example} requiredRole="admin" />
              }
            />
            <Route
              path="/admin"
              element={
                <WithRoleAuth
                  WrappedComponent={AdminDashboard}
                  requiredRole="admin"
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
