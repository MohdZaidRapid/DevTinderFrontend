import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const getFeed = async () => {
    const res = await axios.get(BASE_URL + "/feed");
    
  };
  return <div>Profile</div>;
};

export default Profile;
