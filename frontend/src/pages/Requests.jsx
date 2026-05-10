import React, {
    useEffect,
    useState
} from "react";

import API from "../services/api";

function Requests() {

    const [requests, setRequests] =
        useState([]);

    const [sessionData, setSessionData] =
        useState({});

    useEffect(() => {

        fetchRequests();

    }, []);

    // FETCH REQUESTS

    const fetchRequests = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res = await API.get(
                "/requests",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setRequests(res.data);

        } catch (error) {

            console.log(error);

            alert("Failed to fetch requests");
        }
    };

    // ACCEPT REQUEST

    const acceptRequest = async (requestId) => {

        try {

            const token =
                localStorage.getItem("token");

            await API.put(
                "/requests/accept",
                { requestId },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert("Request Accepted");

            fetchRequests();

        } catch (error) {

            console.log(error);

            alert("Failed to accept request");
        }
    };

    // HANDLE INPUT

    const handleInputChange = (
        requestId,
        field,
        value
    ) => {

        setSessionData((prev) => ({
            ...prev,
            [requestId]: {
                ...prev[requestId],
                [field]: value
            }
        }));
    };

    // CREATE SESSION

    const createSession = async (
        receiverId,
        requestId
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            const session =
                sessionData[requestId];

            await API.post(
                "/sessions/create",
                {
                    receiverId,
                    scheduled_time:
                        session.scheduled_time,
                    duration:
                        session.duration
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert("Session Scheduled");

        } catch (error) {

            console.log(error);

            alert("Failed to create session");
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white p-8">

            <h1 className="text-4xl font-bold mb-10">
                Incoming Requests
            </h1>

            {
                requests.length === 0

                ? (

                    <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center text-gray-300">

                        No Requests Yet

                    </div>
                )

                : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {
                            requests.map((request) => (

                                <div
                                    key={request.id}
                                    className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl"
                                >

                                    {/* USER */}

                                    <div className="flex items-center gap-4 mb-5">

                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">

                                            {
                                                request.name
                                                    ? request.name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "?"
                                            }

                                        </div>

                                        <div>

                                            <h2 className="text-2xl font-semibold">

                                                {
                                                    request.name ||
                                                    "Unknown User"
                                                }

                                            </h2>

                                            <p className="text-gray-400">

                                                {
                                                    request.email ||
                                                    "No Email"
                                                }

                                            </p>

                                        </div>

                                    </div>

                                    {/* STATUS */}

                                    <div className="mb-5">

                                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">

                                            {
                                                request.status ||
                                                "pending"
                                            }

                                        </span>

                                    </div>

                                    {/* ACCEPT BUTTON */}

                                    {
                                        request.status === "pending" && (

                                            <button
                                                onClick={() =>
                                                    acceptRequest(request.id)
                                                }
                                                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl transition-all duration-300 mb-4"
                                            >
                                                Accept Request
                                            </button>
                                        )
                                    }

                                    {/* SESSION SCHEDULER */}

                                    {
                                        request.status === "accepted" && (

                                            <div className="space-y-4">

                                                <input
                                                    type="datetime-local"
                                                    className="w-full bg-white/10 border border-white/10 rounded-xl p-3 outline-none"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            request.id,
                                                            "scheduled_time",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <input
                                                    type="number"
                                                    placeholder="Duration (mins)"
                                                    className="w-full bg-white/10 border border-white/10 rounded-xl p-3 outline-none"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            request.id,
                                                            "duration",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <button
                                                    onClick={() =>
                                                        createSession(
                                                            request.sender_id,
                                                            request.id
                                                        )
                                                    }
                                                    className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl transition-all duration-300"
                                                >
                                                    Schedule Session
                                                </button>

                                            </div>
                                        )
                                    }

                                </div>
                            ))
                        }

                    </div>
                )
            }

        </div>
    );
}

export default Requests;