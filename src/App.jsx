import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import BlockedUser from "./components/BlockedUser";
import WithRoleAuth from "./components/WithRoleAuth"; // Capitalized HOC
import Example from "./components/Example"; // Capitalized Component

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
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

            {/* Admin Routes Protected by HOC */}
            <Route
              path="/example"
              element={
                <WithRoleAuth WrappedComponent={Example} requiredRole="admin" />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
