import React, {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import Peer from "peerjs";

import socket from "../socket";

import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaVideo,
    FaVideoSlash,
    FaDesktop,
    FaComments
} from "react-icons/fa";

function SessionRoom() {

    const { sessionId } =
        useParams();

    const localVideoRef =
        useRef(null);

    const remoteVideoRef =
        useRef(null);

    const messagesEndRef =
        useRef(null);

    const peerRef =
        useRef(null);

    const [peerId, setPeerId] =
        useState("");

    const [remoteUsername, setRemoteUsername] =
        useState("Participant");

    const [remoteConnected, setRemoteConnected] =
        useState(false);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [typing, setTyping] =
        useState("");

    const [micOn, setMicOn] =
        useState(true);

    const [cameraOn, setCameraOn] =
        useState(true);

    const [screenSharing, setScreenSharing] =
        useState(false);

    const [showChat, setShowChat] =
        useState(false);

    /* SESSION TIMER */

    const SESSION_DURATION =
        30 * 60;

    const [timeLeft, setTimeLeft] =
        useState(
            SESSION_DURATION
        );

    /* MAIN */

    useEffect(() => {

        let localStream;

        const storedUser =
            JSON.parse(
                localStorage.getItem(
                    "user"
                )
            );

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true
            })
            .then((stream) => {

                localStream =
                    stream;

                /* LOCAL VIDEO */

                if (
                    localVideoRef.current
                ) {

                    localVideoRef.current.srcObject =
                        stream;
                }

                /* CREATE PEER */

                peerRef.current =
                    new Peer(
                        undefined,
                        {
                            host: "127.0.0.1",
                            port: 9000,
                            path: "/",
                            secure: false
                        }
                    );

                /* PEER OPEN */

                peerRef.current.on(
                    "open",
                    (id) => {

                        setPeerId(id);

                        socket.emit(
                            "join_room",
                            {
                                room: sessionId,
                                peerId: id,
                                name:
                                    storedUser?.name ||
                                    "User"
                            }
                        );
                    }
                );

                /* EXISTING USERS */

                socket.on(
                    "all-users",
                    (users) => {

                        users.forEach(
                            (user) => {

                                const remotePeerId =
                                    user.peerId;

                                setRemoteUsername(
                                    user.name
                                );

                                const call =
                                    peerRef.current.call(
                                        remotePeerId,
                                        stream
                                    );

                                call.on(
                                    "stream",
                                    (
                                        remoteStream
                                    ) => {

                                        setRemoteConnected(
                                            true
                                        );

                                        if (
                                            remoteVideoRef.current
                                        ) {

                                            remoteVideoRef.current.srcObject =
                                                remoteStream;

                                            remoteVideoRef.current
                                                .play()
                                                .catch(
                                                    (
                                                        err
                                                    ) =>
                                                        console.log(
                                                            err
                                                        )
                                                );
                                        }
                                    }
                                );
                            }
                        );
                    }
                );

                /* USER CONNECTED */

                socket.on(
                    "user-connected",
                    (user) => {

                        setRemoteUsername(
                            user.name
                        );
                    }
                );

                /* RECEIVE CALL */

                peerRef.current.on(
                    "call",
                    (call) => {

                        call.answer(
                            stream
                        );

                        call.on(
                            "stream",
                            (
                                remoteStream
                            ) => {

                                setRemoteConnected(
                                    true
                                );

                                if (
                                    remoteVideoRef.current
                                ) {

                                    remoteVideoRef.current.srcObject =
                                        remoteStream;

                                    remoteVideoRef.current
                                        .play()
                                        .catch(
                                            (
                                                err
                                            ) =>
                                                console.log(
                                                    err
                                                )
                                        );
                                }
                            }
                        );
                    }
                );

            })
            .catch((err) => {

                console.log(err);

                alert(
                    "Camera/Microphone access denied"
                );
            });

        /* RECEIVE MESSAGE */

        socket.on(
            "receive_message",
            (data) => {

                setMessages(
                    (prev) => [
                        ...prev,
                        data
                    ]
                );
            }
        );

        /* TYPING */

        socket.on(
            "user_typing",
            (data) => {

                setTyping(
                    data
                );

                setTimeout(() => {

                    setTyping("");

                }, 2000);
            }
        );

        /* CLEANUP */

        return () => {

            socket.off(
                "all-users"
            );

            socket.off(
                "user-connected"
            );

            socket.off(
                "receive_message"
            );

            socket.off(
                "user_typing"
            );

            if (
                peerRef.current
            ) {

                peerRef.current.destroy();
            }

            if (
                localStream
            ) {

                localStream
                    .getTracks()
                    .forEach(
                        (
                            track
                        ) => track.stop()
                    );
            }
        };

    }, [sessionId]);

    /* TIMER */

    useEffect(() => {

        if (timeLeft <= 0) {

            alert(
                "Session ended"
            );

            if (
                peerRef.current
            ) {

                peerRef.current.destroy();
            }

            window.location.href =
                "/sessions";

            return;
        }

        const timer =
            setInterval(() => {

                setTimeLeft(
                    (prev) =>
                        prev - 1
                );

            }, 1000);

        return () =>
            clearInterval(
                timer
            );

    }, [timeLeft]);

    /* AUTO SCROLL */

    useEffect(() => {

        messagesEndRef.current
            ?.scrollIntoView({
                behavior: "smooth"
            });

    }, [messages]);

    /* FORMAT TIMER */

    const formatTime =
        (secs) => {

            const mins =
                Math.floor(
                    secs / 60
                );

            const sec =
                secs % 60;

            return `${String(
                mins
            ).padStart(
                2,
                "0"
            )}:${String(
                sec
            ).padStart(
                2,
                "0"
            )}`;
        };

    /* SEND MESSAGE */

    const sendMessage = () => {

        if (
            message.trim() === ""
        ) return;

        const data = {
            room: sessionId,
            text: message,
            sender: peerId
        };

        socket.emit(
            "send_message",
            data
        );

        setMessage("");
    };

    /* TYPING */

    const handleTyping = () => {

        socket.emit(
            "typing",
            {
                room: sessionId,
                text: `${remoteUsername} is typing...`
            }
        );
    };

    /* MIC */

    const toggleMic = () => {

        const audioTrack =
            localVideoRef.current
                ?.srcObject
                ?.getAudioTracks()[0];

        if (audioTrack) {

            audioTrack.enabled =
                !audioTrack.enabled;

            setMicOn(
                audioTrack.enabled
            );
        }
    };

    /* CAMERA */

    const toggleCamera = () => {

        const videoTrack =
            localVideoRef.current
                ?.srcObject
                ?.getVideoTracks()[0];

        if (videoTrack) {

            videoTrack.enabled =
                !videoTrack.enabled;

            setCameraOn(
                videoTrack.enabled
            );
        }
    };

    /* SCREEN SHARE */

    const startScreenShare =
        async () => {

            try {

                const screenStream =
                    await navigator
                        .mediaDevices
                        .getDisplayMedia({
                            video: true
                        });

                const screenTrack =
                    screenStream
                        .getVideoTracks()[0];

                const sender =
                    peerRef.current?._connections &&
                    Object.values(
                        peerRef.current._connections
                    )[0]?.[0]
                        ?.peerConnection
                        ?.getSenders()
                        .find(
                            (s) =>
                                s.track.kind ===
                                "video"
                        );

                if (sender) {

                    sender.replaceTrack(
                        screenTrack
                    );
                }

                if (
                    localVideoRef.current
                ) {

                    localVideoRef.current.srcObject =
                        screenStream;
                }

                setScreenSharing(
                    true
                );

                /* STOP SHARE */

                screenTrack.onended =
                    async () => {

                        const cameraStream =
                            await navigator
                                .mediaDevices
                                .getUserMedia({
                                    video: true,
                                    audio: true
                                });

                        const cameraTrack =
                            cameraStream
                                .getVideoTracks()[0];

                        if (
                            localVideoRef.current
                        ) {

                            localVideoRef.current.srcObject =
                                cameraStream;
                        }

                        const sender =
                            peerRef.current?._connections &&
                            Object.values(
                                peerRef.current._connections
                            )[0]?.[0]
                                ?.peerConnection
                                ?.getSenders()
                                .find(
                                    (s) =>
                                        s.track &&
                                        s.track.kind ===
                                        "video"
                                );

                        if (sender) {

                            sender.replaceTrack(
                                cameraTrack
                            );
                        }

                        setScreenSharing(
                            false
                        );
                    };

            } catch (err) {

                console.log(err);
            }
        };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col">

            {/* HEADER */}

            <div className="p-5 border-b border-white/10 flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">

                        Synkly Session

                    </h1>

                    <p className="text-gray-400 mt-1 break-all">

                        Peer ID: {peerId}

                    </p>

                </div>

                {/* TIMER */}

                <div className="bg-red-500/20 border border-red-500 px-6 py-3 rounded-2xl text-2xl font-bold text-red-300 shadow-lg">

                    {formatTime(timeLeft)}

                </div>

            </div>

            {/* MAIN */}

            <div className="flex flex-1 overflow-hidden">

                {/* VIDEO SECTION */}

                <div className="flex-1 p-6 grid md:grid-cols-2 gap-6">

                    {/* LOCAL VIDEO */}

                    <div className="bg-white/10 rounded-3xl p-4">

                        <h2 className="text-xl font-semibold mb-3">

                            You

                        </h2>

                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-[400px] bg-black rounded-2xl object-cover"
                        />

                    </div>

                    {/* REMOTE VIDEO */}

                    <div className="bg-white/10 rounded-3xl p-4">

                        <h2 className="text-xl font-semibold mb-3">

                            {remoteUsername}

                        </h2>

                        {
                            remoteConnected ? (

                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-[400px] bg-black rounded-2xl object-cover"
                                />

                            ) : (

                                <div className="w-full h-[400px] bg-black rounded-2xl flex items-center justify-center">

                                    <div className="text-center">

                                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>

                                        <p className="text-2xl font-semibold text-gray-300">

                                            Waiting for participant...

                                        </p>

                                    </div>

                                </div>
                            )
                        }

                    </div>

                    {/* CONTROLS */}

                    <div className="col-span-2 flex gap-4 justify-center items-center">

                        <button
                            onClick={toggleMic}
                            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-2xl"
                        >

                            {
                                micOn
                                    ? <FaMicrophone />
                                    : <FaMicrophoneSlash />
                            }

                        </button>

                        <button
                            onClick={toggleCamera}
                            className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-2xl"
                        >

                            {
                                cameraOn
                                    ? <FaVideo />
                                    : <FaVideoSlash />
                            }

                        </button>

                        <button
                            onClick={startScreenShare}
                            className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-2xl"
                        >

                            <FaDesktop />

                        </button>

                        <button
                            onClick={() => {

                                setShowChat(
                                    !showChat
                                );
                            }}
                            className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-2xl"
                        >

                            <FaComments />

                        </button>

                        <button
                            onClick={() => {

                                window.location.href =
                                    "/sessions";
                            }}
                            className="px-6 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-lg font-semibold"
                        >

                            Leave

                        </button>

                    </div>

                </div>

                {/* CHAT */}

                {
                    showChat && (

                        <div className="w-[380px] border-l border-white/10 bg-black/30 flex flex-col">

                            <div className="p-4 border-b border-white/10">

                                <h2 className="text-2xl font-bold">

                                    Session Chat

                                </h2>

                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">

                                {
                                    messages.map(
                                        (
                                            msg,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                                className={`rounded-2xl p-3 ${
                                                    msg.sender === peerId
                                                        ? "bg-blue-600 ml-10"
                                                        : "bg-white/10 mr-10"
                                                }`}
                                            >

                                                <p className="text-xs text-gray-300">

                                                    {
                                                        msg.sender === peerId
                                                            ? "You"
                                                            : remoteUsername
                                                    }

                                                </p>

                                                <p className="mt-1">

                                                    {msg.text}

                                                </p>

                                            </div>
                                        )
                                    )
                                }

                                <div ref={messagesEndRef} />

                            </div>

                            <div className="px-4 text-sm text-gray-400 h-6">

                                {typing}

                            </div>

                            <div className="p-4 border-t border-white/10 flex gap-3">

                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => {

                                        setMessage(
                                            e.target.value
                                        );

                                        handleTyping();
                                    }}
                                    onKeyDown={(e) => {

                                        if (e.key === "Enter") {

                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Type message..."
                                    className="flex-1 bg-white/10 rounded-xl px-4 py-3 outline-none"
                                />

                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-600 px-5 rounded-xl hover:bg-blue-700"
                                >

                                    Send

                                </button>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
}

export default SessionRoom;