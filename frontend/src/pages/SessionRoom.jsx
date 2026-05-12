import React, {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import Peer from "peerjs";

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

        /* CREATE PEER */

        const peer =
            new Peer(
                undefined,
                {
                    host: "127.0.0.1",
                    port: 9000,
                    path: "/",
                    secure: false
                }
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
            }
        );

        /* PEER ERRORS */

        peer.on(
            "error",
            (err) => {

                console.log(
                    "PEER ERROR:",
                    err
                );
            }
        );

        /* ACCESS CAMERA + MIC */

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true
            })
            .then((stream) => {

                /* SHOW LOCAL VIDEO */

                if (
                    localVideoRef.current
                ) {

                    localVideoRef.current.srcObject =
                        stream;
                }

                /* WAIT BEFORE ASKING */

                setTimeout(() => {

                    const otherPeerId =
                        prompt(
                            "Enter other user's Peer ID"
                        );

                    /* CALL OTHER USER */

                    if (
                        otherPeerId
                    ) {

                        const call =
                            peer.call(
                                otherPeerId,
                                stream
                            );

                        /* RECEIVE REMOTE VIDEO */

                        call.on(
                            "stream",
                            (
                                remoteStream
                            ) => {

                                if (
                                    remoteVideoRef.current
                                ) {

                                    remoteVideoRef.current.srcObject =
                                        remoteStream;
                                }
                            }
                        );
                    }

                }, 3000);

                /* ANSWER INCOMING CALL */

                peer.on(
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

                console.log(err);

                alert(
                    "Camera/Microphone access denied"
                );
            });

    }, []);

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col">

            {/* HEADER */}

            <div className="p-6 border-b border-white/10">

                <h1 className="text-4xl font-bold">

                    Synkly Session Room

                </h1>

                <p className="text-gray-400 mt-2">

                    Live collaborative learning

                </p>

            </div>

            {/* PEER ID */}

            <div className="px-6 pt-6">

                <div className="bg-blue-900/50 border border-blue-500/20 rounded-3xl p-6">

                    <p className="text-lg text-gray-300">

                        Your Peer ID

                    </p>

                    <p className="text-3xl font-bold mt-2 break-all">

                        {
                            peerId
                                ? peerId
                                : "Connecting..."
                        }

                    </p>

                </div>

            </div>

            {/* VIDEO GRID */}

            <div className="flex-1 grid md:grid-cols-2 gap-6 p-6">

                {/* LOCAL VIDEO */}

                <div className="bg-white/10 border border-white/10 rounded-3xl p-5">

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

                <div className="bg-white/10 border border-white/10 rounded-3xl p-5">

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

            {/* FOOTER */}

            <div className="p-6 border-t border-white/10 flex justify-between items-center">

                <div className="text-gray-400">

                    Session ID:
                    {" "}
                    {sessionId}

                </div>

                <button
                    className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl transition-all duration-300"
                >

                    Leave Session

                </button>

            </div>

        </div>
    );
}

export default SessionRoom;