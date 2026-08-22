import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, addMessage, getCurrentUserId } from "../actions/postAction";
import ConnectionPage from "./ConnectionPage";
import "../public/MessagePage.css";

function MessagePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const receiver = location.state?.receiver;

  const [body, setBody] = useState("");

  const {
    userId,
    messages,
    messageLoading
  } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (!userId) {
      dispatch(getCurrentUserId());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && receiver?._id) {
      dispatch(
        getMessages({
          senderId: userId,
          receiverId: receiver._id
        })
      );
    }
  }, [dispatch, userId, receiver?._id]);

  const handleSendMessage = async () => {
    if (!body.trim()) return;

    await dispatch(
      addMessage({
        senderId: userId,
        receiverId: receiver._id,
        body
      })
    );

    setBody("");
  };

  if (!receiver) {
    return <ConnectionPage />;
  }

  return (
    <>
      <ConnectionPage />
      <div className="message-page">

      <div className="message-header">
        <h2>New message</h2>
        <div className="message-window-actions">
          <button type="button" aria-label="Minimize message window">⌄</button>
          <button
            type="button"
            onClick={() => navigate("/users/connectionPage")}
            aria-label="Close message window"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="message-recipient-row">
        <span>To:</span>
        <strong>{receiver.name}</strong>
      </div>

      <div className="message-profile">
        <div className="message-avatar">
          {receiver.profilePicture?.url ? (
            <img src={receiver.profilePicture.url} alt={receiver.name} />
          ) : (
            receiver.name?.charAt(0).toUpperCase()
          )}
          <i />
        </div>
        <div>
          <h3>{receiver.name}</h3>
          <p>@{receiver.username}</p>
        </div>
      </div>

      <div className="message-list">

        {messageLoading && <p>Loading messages...</p>}

        {messages?.map((message) => (
          <div
            key={message._id}
            className={
              message.senderId === userId
                ? "sent-message"
                : "received-message"
            }
          >
            <p>{message.body}</p>

            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
        ))}

      </div>

      <div className="message-input">

        <textarea
          placeholder="Write a message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <div className="message-toolbar">
          <div className="message-tools" aria-hidden="true">
           
           
          </div>
          <button onClick={handleSendMessage} disabled={!body.trim()}>Send</button>
        </div>

      </div>

      </div>
    </>
  );
}

export default MessagePage;
