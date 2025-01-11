import jwt from "jsonwebtoken";
import adminSeeder from "./src/adminSeeder";
import app from "./src/app";
import { envConfig } from "./src/config/config";
import categoryController from "./src/controllers/categoryContoller"; 
import User from "./src/database/models/userModel";
import { Server } from "socket.io";

function startServer() {
  const port = envConfig.port || 4000;
  const server = app.listen(port, () => {
    categoryController.seedCategory(); // Fixed typo in controller name
    console.log(`Server has been started at ${port}`);
    adminSeeder();
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  let onlineUsers: { socketId: string; userId: string; role: string }[] = [];

  const addToOnlineUsers = (socketId: string, userId: string, role: string) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({ socketId, userId, role }); // Fixed typo here
  };

  const removeFromOnlineUsers = (socketId: string) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };

  io.on("connection", (socket) => {
    const { token } = socket.handshake.auth;

    if (token) {
      jwt.verify(token, envConfig.jwtSecreteKey as string, async (err: any, result: any) => {
        if (err) {
          socket.emit("Error in socket connection", err);
          socket.disconnect(); // Optionally disconnect the socket on error
        } else {
          const userData = await User.findByPk(result.userId);
          if (!userData) {
            socket.emit("User  not found", "error");
            return;
          }
          // Add user to online users
          addToOnlineUsers(socket.id, result.userId, userData.role);
          console.log(`User  ${userData.username} connected`); // Log user connection
        }
      });
    }

    // Handle socket disconnection
    socket.on("disconnect", () => {
      removeFromOnlineUsers(socket.id);
      console.log(`User  disconnected: ${socket.id}`);
    });
  });
}

startServer();