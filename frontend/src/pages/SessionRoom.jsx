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

function SessionRoom() {

    const { sessionId } =
        useParams();

    const localVideoRef =
        useRef(null);

    const remoteVideoRef =
        useRef(null);

    const [peerId, setPeerId] =
        useState("");

    useEffect(() => {

        console.log(
            "SESSION ROOM LOADED"
        );

        let localStream;

        let peer;

        /* GET CAMERA + MIC */

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true
            })
            .then((stream) => {

                console.log(
                    "MEDIA ACCESS GRANTED"
                );

                localStream = stream;

                /* SHOW LOCAL VIDEO */

                if (
                    localVideoRef.current
                ) {

                    localVideoRef.current.srcObject =
                        stream;
                }

                /* CREATE PEER */

                peer =
                    new Peer(
                        undefined,
                        {
                            host: "127.0.0.1",
                            port: 9000,
                            path: "/",
                            secure: false
                        }
                    );

                console.log(
                    "PEER OBJECT CREATED"
                );

                /* PEER CONNECTED */

                peer.on(
                    "open",
                    (id) => {

                        console.log(
                            "CONNECTED PEER:",
                            id
                        );

                        setPeerId(id);

                        socket.emit(
                            "join_room",
                            {
                                room: sessionId,
                                peerId: id
                            }
                        );
                    }
                );

                /* PEER ERROR */

                peer.on(
                    "error",
                    (err) => {

                        console.log(
                            "PEER ERROR:",
                            err
                        );
                    }
                );

                /* EXISTING USERS */

                socket.on(
                    "all-users",
                    (users) => {

                        console.log(
                            "ALL USERS:",
                            users
                        );

                        users.forEach(
                            (
                                remotePeerId
                            ) => {

                                console.log(
                                    "CALLING:",
                                    remotePeerId
                                );

                                const call =
                                    peer.call(
                                        remotePeerId,
                                        stream
                                    );

                                call.on(
                                    "stream",
                                    (
                                        remoteStream
                                    ) => {

                                        console.log(
                                            "REMOTE STREAM RECEIVED"
                                        );

                                        if (
                                            remoteVideoRef.current
                                        ) {

                                            remoteVideoRef.current.srcObject =
                                                remoteStream;
                                        }
                                    }
                                );
                            }
                        );
                    }
                );

                /* RECEIVE CALL */

                peer.on(
                    "call",
                    (call) => {

                        console.log(
                            "ANSWERING CALL"
                        );

                        call.answer(
                            stream
                        );

                        call.on(
                            "stream",
                            (
                                remoteStream
                            ) => {

                                console.log(
                                    "RECEIVED STREAM"
                                );

                                if (
                                    remoteVideoRef.current
                                ) {

                                    remoteVideoRef.current.srcObject =
                                        remoteStream;
                                }
                            }
                        );
                    }
                );

            })
            .catch((err) => {

                console.log(
                    "MEDIA ERROR:",
                    err
                );

                alert(
                    "Camera/Microphone access denied"
                );
            });

        /* CLEANUP */

        return () => {

            console.log(
                "FULL CLEANUP"
            );

            socket.off(
                "all-users"
            );

            socket.off(
                "user-connected"
            );

            if (
                peer
            ) {

                peer.destroy();
            }

            if (
                localStream
            ) {

                localStream
                    .getTracks()
                    .forEach(
                        (
                            track
                        ) => {

                            track.stop();
                        }
                    );
            }

            if (
                localVideoRef.current
            ) {

                localVideoRef.current.srcObject =
                    null;
            }

            if (
                remoteVideoRef.current
            ) {

                remoteVideoRef.current.srcObject =
                    null;
            }
        };

    }, [sessionId]);

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col">

            {/* HEADER */}

            <div className="p-6 border-b border-white/10">

                <h1 className="text-4xl font-bold">

                    Synkly Session Room

                </h1>

                <p className="text-gray-400 mt-2">

                    Live realtime collaboration

                </p>

            </div>

            {/* PEER ID */}

            <div className="px-6 pt-6">

                <div className="bg-blue-900/50 border border-blue-500/20 rounded-3xl p-6">

                    <p className="text-lg text-gray-300">

                        Your Peer ID

                    </p>

                    <p className="text-xl font-bold mt-2 break-all">

                        {
                            peerId ||
                            "Connecting..."
                        }

                    </p>

                </div>

            </div>

            {/* VIDEOS */}

            <div className="flex-1 grid md:grid-cols-2 gap-6 p-6">

                {/* LOCAL VIDEO */}

                <div className="bg-white/10 rounded-3xl p-5">

                    <h2 className="text-2xl font-semibold mb-4">

                        Your Video

                    </h2>

                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-[500px] rounded-2xl bg-black object-cover"
                    />

                </div>

                {/* REMOTE VIDEO */}

                <div className="bg-white/10 rounded-3xl p-5">

                    <h2 className="text-2xl font-semibold mb-4">

                        Peer Video

                    </h2>

                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-[500px] rounded-2xl bg-black object-cover"
                    />

                </div>

            </div>

        </div>
    );
}

export default SessionRoom;