const express = require("express");

const cors = require("cors");

require("dotenv").config();

const http = require("http");

const { Server } =
    require("socket.io");

const pool =
    require("./config/db");

/* ROUTES */

const userRoutes =
    require("./routes/userRoutes");

const matchRoutes =
    require("./routes/matchRoutes");

const requestRoutes =
    require("./routes/requestRoutes");

const sessionRoutes =
    require("./routes/sessionRoutes");

const messageRoutes =
    require("./routes/messageRoutes");

/* APP */

const app = express();

/* HTTP SERVER */

const server =
    http.createServer(app);

/* SOCKET.IO */

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

/* ONLINE USERS */

const onlineUsers = {};

/* VIDEO ROOMS */

const rooms = {};

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

/* ROUTES */

app.use("/api/users", userRoutes);

app.use("/api/matches", matchRoutes);

app.use("/api/requests", requestRoutes);

app.use("/api/sessions", sessionRoutes);

app.use("/api/messages", messageRoutes);

/* TEST ROUTE */

app.get("/", (req, res) => {

    res.send("Synkly API Running");
});

/* DATABASE TEST */

pool.connect()
    .then(() => {

        console.log(
            "PostgreSQL Connected"
        );
    })
    .catch((err) => {

        console.log(err);
    });

/* SOCKET CONNECTION */

io.on("connection", (socket) => {

    console.log(
        "User Connected:",
        socket.id
    );

    /* USER ONLINE */

    socket.on(
        "user_online",
        (userId) => {

            onlineUsers[userId] =
                socket.id;

            io.emit(
                "online_users",
                Object.keys(
                    onlineUsers
                )
            );
        }
    );

    /* JOIN VIDEO ROOM */

    socket.on(
    "join_room",
    ({ room, peerId }) => {

        socket.join(room);

        console.log(
            "JOIN ROOM:",
            room,
            peerId
        );

        /* CREATE ROOM */

        if (!rooms[room]) {

            rooms[room] = [];
        }

        /* REMOVE DUPLICATES */

        rooms[room] =
            rooms[room].filter(
                (user) =>
                    user.socketId !== socket.id
            );

        /* EXISTING USERS */

        const existingUsers =
            rooms[room].map(
                (user) =>
                    user.peerId
            );

        console.log(
            "EXISTING USERS:",
            existingUsers
        );

        /* SEND USERS */

        socket.emit(
            "all-users",
            existingUsers
        );

        /* ADD CURRENT USER */

        rooms[room].push({
            socketId: socket.id,
            peerId: peerId
        });

        console.log(
            "ROOM STATE:",
            rooms[room]
        );

        /* DISCONNECT */

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "DISCONNECTED:",
                    socket.id
                );

                if (
                    rooms[room]
                ) {

                    rooms[room] =
                        rooms[room].filter(
                            (user) =>
                                user.socketId !== socket.id
                        );

                    if (
                        rooms[room]
                            .length === 0
                    ) {

                        delete rooms[room];
                    }

                    console.log(
                        "UPDATED ROOM:",
                        rooms[room]
                    );
                }
            }
        );
    }
);

    /* SEND MESSAGE */

    socket.on(
        "send_message",
        (data) => {

            io.to(data.room).emit(
                "receive_message",
                data
            );
        }
    );

    /* TYPING */

    socket.on(
        "typing",
        (data) => {

            socket.to(data.room).emit(
                "user_typing",
                data
            );
        }
    );

    /* GENERAL DISCONNECT */

    socket.on(
        "disconnect",
        () => {

            for (
                let userId
                in onlineUsers
            ) {

                if (
                    onlineUsers[userId] ===
                    socket.id
                ) {

                    delete onlineUsers[userId];
                }
            }

            io.emit(
                "online_users",
                Object.keys(
                    onlineUsers
                )
            );

            console.log(
                "User Disconnected:",
                socket.id
            );
        }
    );
});

/* START SERVER */

const PORT =
    process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});