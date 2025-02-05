import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const VideoCall = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  const socket = createSocketConnection();

  useEffect(() => {
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("incomingCall", ({ fromUserId, offer }) => {
      if (fromUserId !== userId) {
        setIncomingCall({ fromUserId, offer });
      }
    });

    socket.on("callAnswered", ({ answer }) => {
      peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("iceCandidate", ({ candidate }) => {
      if (peerConnection.current && candidate) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const startCall = async () => {
    setIsCalling(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    peerConnection.current = createPeerConnection();
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("callUser", { fromUserId: userId, toUserId: targetUserId, offer });
  };

  const answerCall = async () => {
    setIsCalling(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    peerConnection.current = createPeerConnection();
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answerCall", { fromUserId: userId, toUserId: incomingCall.fromUserId, answer });
    setIncomingCall(null);
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          fromUserId: userId,
          toUserId: targetUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    return pc;
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsCalling(false);
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;

    socket.emit("endCall", { fromUserId: userId, toUserId: targetUserId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white bg-opacity-80 rounded-xl shadow-2xl p-6 flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold text-indigo-700">Video Call</h1>

        <div className="flex justify-center space-x-4">
          <video ref={localVideoRef} autoPlay muted className="w-60 h-40 rounded-lg shadow-md bg-black" />
          <video ref={remoteVideoRef} autoPlay className="w-60 h-40 rounded-lg shadow-md bg-black" />
        </div>

        {!isCalling && !incomingCall && (
          <button
            onClick={startCall}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 shadow-md"
          >
            Start Call
          </button>
        )}

        {incomingCall && (
          <div className="flex flex-col items-center space-y-2">
            <p className="text-indigo-600 font-semibold">Incoming Call...</p>
            <button
              onClick={answerCall}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 shadow-md"
            >
              Answer Call
            </button>
          </div>
        )}

        {isCalling && (
          <button
            onClick={endCall}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 shadow-md"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
