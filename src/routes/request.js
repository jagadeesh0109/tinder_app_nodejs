const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ['ignored', 'interested'];
      if(!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Invalid status type" + status
        })
      }

      const toUser = await User.findById(toUserId)
      if(!toUser) {
        return res.status(400).json({message: 'User not found!!'})
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
      })

      if(existingConnectionRequest) {
        res.status(400).json({message: 'already exists'})
      }

      const connectRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectRequest.save();
      res.json({
        message: "Connection request sent successfully",
        data

      })
    } catch (err) {
      res.status(400).send("ERROR-" + err.message);
    }
  },
);

module.exports = requestRouter;
