const socket = require("socket.io");
const crypto = require("crypto")


//to have secured roomid
const getSecretRoomId = (userId, targetUserId) => {
return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({firstName, userId, targetUserId }) => {
        // room must have uniqueID so it meant only for communication b/w sender and receiver
      const roomId = getSecretRoomId(userId, targetUserId);
   
      socket.join(roomId);
    });


    socket.on("sendMessage", ( {
        firstName,
        userId,
        targetUserId,
        text
        }) => {
       
       const roomId = getSecretRoomId(userId, targetUserId);
       
        io.to(roomId).emit("messageReceived", {firstName, text})
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket