import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, currentIndex, showActions = { interested: true, ignore: true, block: true } }) => {
  const { _id, firstName, lastName, photoUrl, gender, age, about } = user;
  const [message, setMessage] = useState("");
  const [isMessage, setIsMessage] = useState(false);
  const [errors, setErrors] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const handleSentRequest = async (status, userId) => {
    try {
      setErrors("");
      setIsError(false);
      await axios.post(
        `${BASE_URL}/request/sent/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId)); // Remove the user from the feed
    } catch (error) {
      setIsError(true);
      setErrors(error?.response?.data?.message);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      setErrors("");
      setIsError(false);
      const res = await axios.post(
        `${BASE_URL}/block/${userId}`,
        {},
        { withCredentials: true }
      );
      setIsMessage(true);
      setMessage(res?.data?.message);
      dispatch(removeUserFromFeed(userId)); // Remove the blocked user
    } catch (error) {
      setErrors(error?.response?.data?.message);
      setIsError(true);
      setIsMessage(false);
    }
  };

  return (
    <div className="card card-compact bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="User photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName}`}</h2>
        {age && gender && <p>{`${age}, ${gender}`}</p>}
        <p>{about}</p>

        <div className="card-actions justify-center my-4">
          {showActions.ignore && (
            <button
              className="btn btn-primary"
              onClick={() => handleSentRequest("ignored", _id)}
            >
              Ignore
            </button>
          )}
          {showActions.interested && (
            <button
              className="btn btn-secondary"
              onClick={() => handleSentRequest("interested", _id)}
            >
              Interested
            </button>
          )}
          {showActions.block && (
            <button
              className="btn btn-error"
              onClick={() => handleBlockUser(_id)}
            >
              Block User
            </button>
          )}
        </div>
      </div>

      {isMessage && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{errors}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
