import http from "http";

import app from "./app.js";

import {
  initSocket,
} from "./socket/socket.js";

const PORT =
  process.env.PORT || 5000;

const server =
  http.createServer(app);

initSocket(server);

server.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });