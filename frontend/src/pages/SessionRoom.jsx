import React from "react";

import {
    useParams
} from "react-router-dom";

function SessionRoom() {

    const { sessionId } =
        useParams();

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col">

            {/* HEADER */}

            <div className="p-6 border-b border-white/10 flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">

                        Synkly Session Room

                    </h1>

                    <p className="text-gray-400 mt-1">

                        Collaborative learning environment

                    </p>

                </div>

                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">

                    LIVE SESSION

                </div>

            </div>

            {/* MAIN CONTENT */}

            <div className="flex-1 grid lg:grid-cols-3 gap-6 p-6">

                {/* VIDEO AREA */}

                <div className="lg:col-span-2 bg-white/10 border border-white/10 rounded-3xl flex items-center justify-center text-gray-400 text-2xl">

                    Video / Screen Share Area

                </div>

                {/* SIDE PANEL */}

                <div className="bg-white/10 border border-white/10 rounded-3xl p-6 flex flex-col">

                    <h2 className="text-2xl font-semibold mb-4">

                        Session Info

                    </h2>

                    <div className="space-y-4 text-gray-300">

                        <p>

                            Session ID:
                            <span className="text-white ml-2">

                                {sessionId}

                            </span>

                        </p>

                        <p>

                            Status:
                            <span className="text-green-400 ml-2">

                                Active

                            </span>

                        </p>

                    </div>

                    {/* CHAT PLACEHOLDER */}

                    <div className="mt-8 flex-1 bg-black/20 rounded-2xl p-4 overflow-y-auto">

                        <p className="text-gray-400">

                            Session chat coming soon...

                        </p>

                    </div>

                    {/* MESSAGE INPUT */}

                    <div className="mt-4 flex gap-3">

                        <input
                            type="text"
                            placeholder="Message..."
                            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none"
                        />

                        <button
                            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl transition-all duration-300"
                        >

                            Send

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SessionRoom;