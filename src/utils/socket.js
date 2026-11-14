const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");


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


    socket.on("sendMessage", async ({
        firstName,
        lastName,
        userId,
        targetUserId,
        text
        }) => {
       
       const roomId = getSecretRoomId(userId, targetUserId);

       //save message to DB
       try{
        let chat = await Chat.findOne({
            participants: {$all: [userId, targetUserId]}
        })

        if(!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })
        }
        console.log("ln48--->chat- ",chat)
        chat.messages.push({
            senderId: userId,
            text
        })
        await chat.save();
       } catch(err) {
        console.log("error in storing message - ",err)
       }
       // ends
       
        io.to(roomId).emit("messageReceived", {firstName, lastName, text})
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket