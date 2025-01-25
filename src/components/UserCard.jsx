import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, gender, age, about } = user;
  const [errors, setErrors] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const handleSentRequest = async (status, userId) => {
    try {
      setErrors("");
      setIsError(false);
      const res = await axios.post(
        BASE_URL + "/request/sent/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      setIsError(true);
      setErrors(error?.response?.data?.message);
      dispatch(removeUserFromFeed(userId));
      console.log("err", error?.response?.data?.message);
    }
  };
  return (
    <div className="card card-compact bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={user.photoUrl} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName} </h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => handleSentRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSentRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
      {isError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>{errors}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
