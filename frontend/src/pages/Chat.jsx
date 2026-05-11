import React, {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import API from "../services/api";

import io from "socket.io-client";

/* SOCKET */

const socket = io(
    "http://localhost:5000"
);

function Chat() {

    const { userId } =
        useParams();

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [typing, setTyping] =
        useState(false);

    const [onlineUsers, setOnlineUsers] =
        useState([]);

    const currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );

    /* ROOM */

    const room =
        [currentUser.id, userId]
            .sort()
            .join("_");

    /* LOAD CHAT */

    useEffect(() => {

        fetchMessages();

        /* USER ONLINE */

        socket.emit(
            "user_online",
            currentUser.id
        );

        /* JOIN ROOM */

        socket.emit(
            "join_room",
            room
        );

        /* RECEIVE MESSAGE */

        socket.on(
            "receive_message",
            (data) => {

                setMessages((prev) => [
                    ...prev,
                    data
                ]);
            }
        );

        /* ONLINE USERS */

        socket.on(
            "online_users",
            (users) => {

                setOnlineUsers(users);
            }
        );

        /* TYPING */

        socket.on(
            "user_typing",
            () => {

                setTyping(true);

                setTimeout(() => {

                    setTyping(false);

                }, 2000);
            }
        );

        return () => {

            socket.off(
                "receive_message"
            );

            socket.off(
                "online_users"
            );

            socket.off(
                "user_typing"
            );
        };

    }, []);

    /* FETCH OLD MESSAGES */

    const fetchMessages = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res = await API.get(
                `/messages/${userId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setMessages(res.data);

        } catch (error) {

            console.log(error);
        }
    };

    /* SEND MESSAGE */

    const sendMessage = async () => {

        if (!message.trim()) return;

        try {

            const token =
                localStorage.getItem("token");

            /* SAVE TO DATABASE */

            await API.post(
                "/messages/send",
                {
                    receiverId: userId,
                    message
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            /* REALTIME MESSAGE */

            const realtimeMessage = {

                sender_id:
                    currentUser.id,

                receiver_id:
                    userId,

                message,

                created_at:
                    new Date(),

                room
            };

            socket.emit(
                "send_message",
                realtimeMessage
            );

            setMessage("");

        } catch (error) {

            console.log(error);

            alert(
                "Failed to send"
            );
        }
    };

    /* HANDLE TYPING */

    const handleTyping = (e) => {

        setMessage(
            e.target.value
        );

        socket.emit(
            "typing",
            { room }
        );
    };

    /* CHECK ONLINE */

    const isOnline =
        onlineUsers.includes(
            userId.toString()
        );

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col">

            {/* HEADER */}

            <div className="p-6 border-b border-white/10">

                <h1 className="text-3xl font-bold">
                    Synkly Chat
                </h1>

                <div className="flex items-center gap-3 mt-2">

                    <div
                        className={`w-3 h-3 rounded-full ${
                            isOnline
                                ? "bg-green-500"
                                : "bg-gray-500"
                        }`}
                    />

                    <p className="text-gray-400">

                        {
                            isOnline
                                ? "Online"
                                : "Offline"
                        }

                    </p>

                </div>

                {
                    typing && (

                        <p className="text-blue-400 text-sm mt-2">

                            Typing...

                        </p>
                    )
                }

            </div>

            {/* CHAT AREA */}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {
                    messages.map(
                        (msg, index) => {

                            const isMine =
                                msg.sender_id ===
                                currentUser.id;

                            return (

                                <div
                                    key={index}
                                    className={`flex ${
                                        isMine
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >

                                    <div
                                        className={`
                                            max-w-[70%]
                                            px-5
                                            py-3
                                            rounded-2xl
                                            shadow-lg
                                            ${
                                                isMine
                                                    ? "bg-blue-600"
                                                    : "bg-white/10"
                                            }
                                        `}
                                    >

                                        <p>
                                            {msg.message}
                                        </p>

                                        <p className="text-xs text-gray-300 mt-2">

                                            {
                                                new Date(
                                                    msg.created_at
                                                ).toLocaleTimeString()
                                            }

                                        </p>

                                    </div>

                                </div>
                            );
                        }
                    )
                }

            </div>

            {/* INPUT */}

            <div className="p-5 border-t border-white/10 flex gap-4">

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleTyping}
                    className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-3 outline-none"
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl transition-all duration-300"
                >
                    Send
                </button>

            </div>

        </div>
    );
}

export default Chat;