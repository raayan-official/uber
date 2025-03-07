const socketIo = require("socket.io");
const userModel = require("./models/userModel");
const captainModel = require("./models/captainModel");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.onAny((event, ...args) => {});

    // Handle User/Captain Joining
    socket.on("join", async (data) => {
      try {
        const { userId, userType } = data;

        if (userType === "user") {
          await userModel.findOneAndUpdate(
            { _id: userId },
            { socketId: socket.id }
          );
        } else if (userType === "captain") {
          await captainModel.findOneAndUpdate(
            { _id: userId },
            { socketId: socket.id }
          );
        }
      } catch (error) {
        console.error("Error in join event:", error.message);
      }
    });

    // Handle Client Disconnecting
    socket.on("disconnect", async () => {
      try {
        const user = await userModel.findOne({ socketId: socket.id });
        const captain = await captainModel.findOne({ socketId: socket.id });

        if (user) {
          await userModel.updateOne(
            { socketId: socket.id },
            { $unset: { socketId: 1 } }
          );
        } else if (captain) {
          await captainModel.updateOne(
            { socketId: socket.id },
            { $unset: { socketId: 1 } }
          );
        } else {
          console.warn(`No user or captain found with socket ID: ${socket.id}`);
        }
      } catch (error) {
        console.error("Error in disconnect event:", error.message);
      }
    });
  });
}

function sendMessageToSocket(socketId, messageObject) {
  if (!io) {
    console.error("❌ Socket.IO not initialized");
    return false;
  }

  if (!io.sockets.sockets.get(socketId)) {
    console.error(`❌ Socket ID ${socketId} not found in active connections`);
    return false;
  }

  io.to(socketId).emit(messageObject.event, messageObject.data);

  return true;
}

module.exports = { initializeSocket, sendMessageToSocket };
