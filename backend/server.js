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
        methods: [
            "GET",
            "POST"
        ]
    }
});

/* ONLINE USERS */

const onlineUsers = {};

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

/* ROUTES */

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/matches",
    matchRoutes
);

app.use(
    "/api/requests",
    requestRoutes
);

app.use(
    "/api/sessions",
    sessionRoutes
);

app.use(
    "/api/messages",
    messageRoutes
);

/* TEST ROUTE */

app.get("/", (req, res) => {

    res.send(
        "Synkly API Running"
    );
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

io.on(
    "connection",
    (socket) => {

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

        /* JOIN ROOM */

        socket.on(
            "join_room",
            ({
                room,
                peerId,
                name
            }) => {

                console.log(
                    `${name} joined ${room}`
                );

                socket.join(room);

                socket.room =
                    room;

                socket.peerId =
                    peerId;

                socket.name =
                    name;

                /* GET USERS INSIDE ROOM */

                const roomSockets =
                    io.sockets.adapter.rooms.get(
                        room
                    );

                let users = [];

                if (roomSockets) {

                    roomSockets.forEach(
                        (id) => {

                            const s =
                                io.sockets.sockets.get(
                                    id
                                );

                            if (
                                s &&
                                s.peerId &&
                                s.peerId !==
                                peerId
                            ) {

                                users.push({
                                    peerId:
                                        s.peerId,

                                    name:
                                        s.name
                                });
                            }
                        }
                    );
                }

                /* SEND EXISTING USERS */

                socket.emit(
                    "all-users",
                    users
                );

                /* NOTIFY OTHERS */

                socket.to(room).emit(
                    "user-connected",
                    {
                        peerId,
                        name
                    }
                );
            }
        );

        /* SEND MESSAGE */

        socket.on(
            "send_message",
            (data) => {

                io.to(
                    data.room
                ).emit(
                    "receive_message",
                    data
                );
            }
        );

        /* TYPING */

        socket.on(
            "typing",
            (data) => {

                socket
                    .to(data.room)
                    .emit(
                        "user_typing",
                        data
                    );
            }
        );

        /* DISCONNECT */

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "User Disconnected:",
                    socket.id
                );

                for (
                    let userId
                    in onlineUsers
                ) {

                    if (
                        onlineUsers[
                            userId
                        ] === socket.id
                    ) {

                        delete onlineUsers[
                            userId
                        ];
                    }
                }

                io.emit(
                    "online_users",
                    Object.keys(
                        onlineUsers
                    )
                );

                /* NOTIFY ROOM */

                if (
                    socket.room
                ) {

                    socket.to(
                        socket.room
                    ).emit(
                        "user-disconnected",
                        socket.peerId
                    );
                }
            }
        );
    }
);

/* START SERVER */

const PORT =
    process.env.PORT ||
    5000;

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );
    }
);