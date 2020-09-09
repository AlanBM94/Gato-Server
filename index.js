const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
let numberOfPlayers = 0;

io.on("connection", (socket) => {
  console.log("We have a new connection");
  numberOfPlayers++;
  console.log(numberOfPlayers);

  socket.on("join", () => {
    let message =
      numberOfPlayers === 1 ? "Bienvenido jugador 1" : "Bienvenido jugador 2";

    socket.emit("message", {
      text: message,
    });

    socket.emit("setPlayer", { playerId: numberOfPlayers });

    socket.broadcast.emit("message", {
      text: `El jugador ${numberOfPlayers} se ha unido`,
    });

    if (numberOfPlayers > 2) {
      socket.emit("connectionFailed", {
        connectionFailed: true,
      });
    }
  });

  socket.on("buttonPressed", ({ xAxis, yAxis, sign }) => {
    socket.broadcast.emit("setBoard", { xAxis, yAxis, sign });
  });

  socket.on("disconnect", () => {
    numberOfPlayers--;
    console.log("Someone has left the game");
  });
});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
