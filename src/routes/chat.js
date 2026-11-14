const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId",userAuth, async (req, res) => {
    const {targetUserId} = req.params;
    const userId = req.user._id;
    console.log("ln10--->",targetUserId,"-",userId)

try {
  let chat = await Chat.findOne({
    participants: { $all: [userId, targetUserId] },
  }).populate({
    path: "messages.senderId",
    select: "firstName lastName"
  })
  console.log("ln15--->",chat)
  if (!chat) {
    chat = new Chat({
      participants: [userId, targetUserId],
      messages: [],
    });
    await chat.save();
  }
  res.json(chat);
} catch (err) {
  console.log(err);
}

})

module.exports = chatRouter