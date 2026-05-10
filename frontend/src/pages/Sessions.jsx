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
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white p-8">

            <h1 className="text-4xl font-bold mb-10">
                Scheduled Sessions
            </h1>

            {
                sessions.length === 0

                ? (

                    <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center text-gray-300">

                        No Sessions Scheduled

                    </div>
                )

                : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {
                            sessions.map((session) => (

                                <div
                                    key={session.id}
                                    className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl"
                                >

                                    <h2 className="text-2xl font-semibold mb-4">

                                        Session

                                    </h2>

                                    <p className="text-gray-300 mb-2">

                                        Time:
                                        {" "}
                                        {
                                            new Date(
                                                session.scheduled_time
                                            ).toLocaleString()
                                        }

                                    </p>

                                    <p className="text-gray-300 mb-5">

                                        Duration:
                                        {" "}
                                        {session.duration}
                                        {" "}
                                        mins

                                    </p>

                                    <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm inline-block">

                                        {session.status}

                                    </div>

                                </div>
                            ))
                        }

                    </div>
                )
            }

        </div>
    );
}

export default Sessions;