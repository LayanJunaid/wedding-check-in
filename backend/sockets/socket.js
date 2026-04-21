let ioInstance;

function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Client connected 🔥");
  });
}

function getIO() {
  return ioInstance;
}

module.exports = { initSocket, getIO };
