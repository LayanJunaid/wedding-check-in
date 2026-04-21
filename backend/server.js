const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const guestRoutes = require("./routes/guestRoutes");
const authRoutes = require("./routes/authRoutes");
const { initSocket } = require("./sockets/socket");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});

app.set("io", io);
initSocket(io);

app.use("/api/auth", authRoutes);
app.use("/api/guests", guestRoutes);

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
