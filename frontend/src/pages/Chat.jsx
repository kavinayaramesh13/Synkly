import React, {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import API from "../services/api";

function Chat() {

    const { userId } =
        useParams();

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );

    useEffect(() => {

        fetchMessages();

    }, []);

    // FETCH CHAT

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

    // SEND MESSAGE

    const sendMessage = async () => {

        if (!message.trim()) return;

        try {

            const token =
                localStorage.getItem("token");

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

            setMessage("");

            fetchMessages();

        } catch (error) {

            console.log(error);

            alert("Failed to send");
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col">

            {/* HEADER */}

            <div className="p-6 border-b border-white/10">

                <h1 className="text-3xl font-bold">
                    Synkly Chat
                </h1>

                <p className="text-gray-400 mt-1">
                    Discuss and schedule your learning session
                </p>

            </div>

            {/* MESSAGES */}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {
                    messages.map((msg) => {

                        const isMine =
                            msg.sender_id ===
                            currentUser.id;

                        return (

                            <div
                                key={msg.id}
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
                    })
                }

            </div>

            {/* INPUT */}

            <div className="p-5 border-t border-white/10 flex gap-4">

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }
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