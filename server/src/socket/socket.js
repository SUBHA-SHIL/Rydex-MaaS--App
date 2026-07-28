import { Server } from "socket.io";

let io;

const connectedDrivers = {};

export const initSocket = (
  server
) => {

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {

    console.log(
      "User connected:",
      socket.id
    );

    // DRIVER REGISTER

    socket.on(
      "registerDriver",
      (driverId) => {

        connectedDrivers[
          driverId
        ] = socket.id;

        console.log(
          `Driver ${driverId} registered`
        );
      }
    );

    // JOIN CHAT ROOM

    socket.on(
      "joinRideRoom",
      (rideId) => {

        socket.join(
          `ride_${rideId}`
        );

        console.log(
          `Socket joined room ride_${rideId}`
        );
      }
    );

    // SEND MESSAGE

    socket.on(
      "sendMessage",
      (messageData) => {

        io.to(
          `ride_${messageData.ride_id}`
        ).emit(
          "receiveMessage",
          messageData
        );
      }
    );
    // DRIVER LOCATION

    socket.on(
      "driverLocationUpdate",
      (data) => {

        io.emit(
          "driverLocation",
          data
        );
      }
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          "User disconnected:",
          socket.id
        );

        // REMOVE DRIVER

        for (const driverId in connectedDrivers) {

          if (
            connectedDrivers[
            driverId
            ] === socket.id
          ) {

            delete connectedDrivers[
              driverId
            ];

            break;
          }
        }
      }
    );
  });

  return io;
};

export const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};

export const getConnectedDrivers =
  () => connectedDrivers;