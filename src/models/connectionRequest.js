const mongoose = require("mongoose");
const connectionrequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{Value} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionrequestSchema)
module.exports = ConnectionRequestModel
