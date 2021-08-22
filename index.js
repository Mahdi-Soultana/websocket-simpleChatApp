import { Server } from "socket.io";
import http from "http";
import express from "express";
import handler from "serve-handler";

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});
let Msgs = [
  {
    name: "Soultana Mahdi",
    message: "Hellooo",
    time: Date.now(),
  },
];
let activeUsers = 0;
const io = new Server(server, {});

io.on("connection", (socket) => {
  console.log("connected");
  ++activeUsers;
  console.log(activeUsers);

  socket.on("disconnect", () => {
    console.log("disconnect");
    --activeUsers;
    console.log(activeUsers);
  });

  //Listen to Action Emit Client Form
  socket.on("addMsg", (data) => {
    data = { ...data, time: Date.now() };
    Msgs.push(data);
    socket.emit("pushMsg", { Msgs, activeUsers });
  });
  //Push with Emit To All Client Msgs
  socket.emit("pushMsg", { Msgs, activeUsers });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
