import React, {
    useEffect,
    useState
} from "react";

import API from "../services/api";

function Sessions() {

    const [sessions, setSessions] =
        useState([]);

    useEffect(() => {

        fetchSessions();

    }, []);

    /* FETCH SESSIONS */

    const fetchSessions = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res = await API.get(
                "/sessions",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setSessions(res.data);

        } catch (error) {

            console.log(error);

            alert(
                "Failed to fetch sessions"
            );
        }
    };

    /* SESSION STATUS */

    const getSessionStatus = (
        session
    ) => {

        const now =
            new Date();

        const start =
            new Date(
                session.scheduled_time
            );

        const end =
            new Date(
                start.getTime() +
                session.duration *
                60000
            );

        if (now < start) {

            return "locked";
        }

        if (
            now >= start &&
            now <= end
        ) {

            return "active";
        }

        return "ended";
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white p-8">

            {/* HEADER */}

            <div className="mb-10">

                <h1 className="text-4xl font-bold">

                    Your Sessions

                </h1>

                <p className="text-gray-400 mt-2">

                    Scheduled collaborative learning sessions

                </p>

            </div>

            {
                sessions.length === 0

                ? (

                    <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center text-gray-300">

                        No Sessions Yet

                    </div>
                )

                : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {
                            sessions.map(
                                (session) => {

                                    const status =
                                        getSessionStatus(
                                            session
                                        );

                                    return (

                                        <div
                                            key={session.id}
                                            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl"
                                        >

                                            {/* TITLE */}

                                            <h2 className="text-2xl font-semibold mb-5">

                                                Learning Session

                                            </h2>

                                            {/* SESSION DETAILS */}

                                            <div className="space-y-3 mb-6">

                                                <div className="bg-black/20 rounded-2xl p-4">

                                                    <p className="text-gray-400 text-sm">

                                                        Date

                                                    </p>

                                                    <p className="text-lg mt-1">

                                                        {
                                                            new Date(
                                                                session.scheduled_time
                                                            ).toLocaleDateString()
                                                        }

                                                    </p>

                                                </div>

                                                <div className="bg-black/20 rounded-2xl p-4">

                                                    <p className="text-gray-400 text-sm">

                                                        Time

                                                    </p>

                                                    <p className="text-lg mt-1">

                                                        {
                                                            new Date(
                                                                session.scheduled_time
                                                            ).toLocaleTimeString()
                                                        }

                                                    </p>

                                                </div>

                                                <div className="bg-black/20 rounded-2xl p-4">

                                                    <p className="text-gray-400 text-sm">

                                                        Duration

                                                    </p>

                                                    <p className="text-lg mt-1">

                                                        {
                                                            session.duration
                                                        } mins

                                                    </p>

                                                </div>

                                            </div>

                                            {/* SESSION STATUS */}

                                            {
                                                status === "locked" && (

                                                    <div className="bg-yellow-500/20 text-yellow-300 px-4 py-3 rounded-2xl text-center font-semibold">

                                                        Session Locked

                                                    </div>
                                                )
                                            }

                                            {
                                                status === "active" && (

                                                    <button
                                                        onClick={() =>
                                                            window.location.href =
                                                                `/session-room/${session.id}`
                                                        }
                                                        className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-2xl transition-all duration-300 font-semibold"
                                                    >

                                                        Join Session

                                                    </button>
                                                )
                                            }

                                            {
                                                status === "ended" && (

                                                    <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-2xl text-center font-semibold">

                                                        Session Ended

                                                    </div>
                                                )
                                            }

                                        </div>
                                    );
                                }
                            )
                        }

                    </div>
                )
            }

        </div>
    );
}

export default Sessions;