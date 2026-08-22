
const mongoose = require("mongoose");
const Message = require("../../models/messageModel");
const User = require("../../models/userModel");
const Connection = require("../../models/connectionModel");

const findAcceptedConnection = (firstUserId, secondUserId) =>
  Connection.findOne({
    status_accepted: true,
    $or: [
      { userId: firstUserId, connectionId: secondUserId },
      { userId: secondUserId, connectionId: firstUserId },
    ],
  });

const getMessages = async (req, res) => {
  try {
    const { receiverId, token } = req.query;

    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({
        message: "A valid receiverId is required",
      });
    }

    const sender = await User.findOne({ token });
    if (!sender) {
      return res.status(401).json({ message: "Invalid login token" });
    }

    const acceptedConnection = await findAcceptedConnection(sender._id, receiverId);
    if (!acceptedConnection) {
      return res.status(403).json({ message: "You can only message accepted connections" });
    }

    const senderId = sender._id;

    const messages = await Message.find({
      $or: [
        { receiverId, senderId },
        { receiverId: senderId, senderId: receiverId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("Get messages error:", err);

    return res.status(500).json({
      message: "Unable to get messages",
      error: err.message,
    });
  }
};

const addMessage = async (req, res) => {
  try {
    const { receiverId, body, token } = req.body;

    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({
        message: "A valid receiverId is required",
      });
    }

    const sender = await User.findOne({ token });
    if (!sender) {
      return res.status(401).json({ message: "Invalid login token" });
    }

    const acceptedConnection = await findAcceptedConnection(sender._id, receiverId);
    if (!acceptedConnection) {
      return res.status(403).json({ message: "You can only message accepted connections" });
    }

    if (!body?.trim()) {
      return res.status(400).json({
        message: "Message body is required",
      });
    }

    const newMessage = await Message.create({
      senderId: sender._id,
      receiverId,
      body: body.trim(),
    });

    return res.status(201).json({ newMessage });
  } catch (err) {
    console.error("Add message error:", err);

    return res.status(500).json({
      message: "Unable to add message",
      error: err.message,
    });
  }
};

module.exports = { getMessages, addMessage };


