import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import API from "../services/api";

function Dashboard() {

    const navigate =
        useNavigate();

    const [matches, setMatches] =
        useState([]);

    const [user, setUser] =
        useState(null);

    useEffect(() => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            navigate("/");

            return;
        }

        const storedUser =
            JSON.parse(
                localStorage.getItem(
                    "user"
                )
            );

        setUser(storedUser);

        fetchMatches();

    }, []);

    /* FETCH MATCHES */

    const fetchMatches = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const res =
                await API.get(
                    "/matches",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setMatches(res.data);

        } catch (error) {

            console.log(error);

            alert(
                "Failed to fetch matches"
            );
        }
    };

    /* SEND REQUEST */

    const sendRequest = async (
        receiverId
    ) => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            await API.post(
                "/requests/send",
                { receiverId },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Request Sent"
            );

        } catch (error) {

            console.log(error);

            alert(
                "Failed to send request"
            );
        }
    };

    /* LOGOUT */

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white">

            {/* NAVBAR */}

            <div className="flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur-lg">

                <h1 className="text-3xl font-bold">

                    Synkly

                </h1>

                {/* NAV BUTTONS */}

                <div className="flex gap-4">

                    {/* REQUESTS */}

                    <button
                        onClick={() =>
                            navigate(
                                "/requests"
                            )
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl transition-all duration-300"
                    >

                        Requests

                    </button>

                    {/* SESSIONS */}

                    <button
                        onClick={() =>
                            navigate(
                                "/sessions"
                            )
                        }
                        className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl transition-all duration-300"
                    >

                        Sessions

                    </button>

                    {/* LOGOUT */}

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition-all duration-300"
                    >

                        Logout

                    </button>

                </div>

            </div>

            {/* MAIN CONTENT */}

            <div className="p-8">

                {
                    user && (

                        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 mb-10 shadow-xl">

                            <h2 className="text-3xl font-bold mb-2">

                                Welcome back,
                                {" "}
                                {user.name}
                                {" "}
                                👋

                            </h2>

                            <p className="text-gray-300 mb-6">

                                Ready to exchange skills today?

                            </p>

                            <div className="grid md:grid-cols-2 gap-6">

                                {/* OFFERED */}

                                <div>

                                    <h3 className="font-semibold mb-3">

                                        Your Offered Skills

                                    </h3>

                                    <div className="flex flex-wrap gap-2">

                                        {
                                            user.skills_offered.map(
                                                (
                                                    skill,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                        className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                                                    >

                                                        {skill}

                                                    </span>
                                                )
                                            )
                                        }

                                    </div>

                                </div>

                                {/* WANTED */}

                                <div>

                                    <h3 className="font-semibold mb-3">

                                        Skills You Want

                                    </h3>

                                    <div className="flex flex-wrap gap-2">

                                        {
                                            user.skills_wanted.map(
                                                (
                                                    skill,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                        className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                                                    >

                                                        {skill}

                                                    </span>
                                                )
                                            )
                                        }

                                    </div>

                                </div>

                            </div>

                        </div>
                    )
                }

                {/* MATCHES */}

                <h2 className="text-4xl font-bold mb-2">

                    Your Skill Matches

                </h2>

                <p className="text-gray-300 mb-10">

                    Connect and exchange knowledge

                </p>

                {
                    matches.length === 0

                    ? (

                        <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center text-gray-300">

                            No matches found

                        </div>
                    )

                    : (

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {
                                matches.map(
                                    (user) => (

                                        <div
                                            key={user.id}
                                            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl hover:scale-105 transition-all duration-300"
                                        >

                                            {/* TOP */}

                                            <div className="flex items-center justify-between mb-4">

                                                <h3 className="text-2xl font-semibold">

                                                    {user.name}

                                                </h3>

                                                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">

                                                    {
                                                        user.matchPercentage
                                                    }%
                                                    {" "}
                                                    Match

                                                </div>

                                            </div>

                                            {/* EMAIL */}

                                            <p className="text-gray-300 mb-5">

                                                {user.email}

                                            </p>

                                            {/* OFFERED */}

                                            <div className="mb-4">

                                                <h4 className="font-semibold mb-2">

                                                    Skills Offered

                                                </h4>

                                                <div className="flex flex-wrap gap-2">

                                                    {
                                                        user.skills_offered.map(
                                                            (
                                                                skill,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={index}
                                                                    className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                                                                >

                                                                    {skill}

                                                                </span>
                                                            )
                                                        )
                                                    }

                                                </div>

                                            </div>

                                            {/* WANTED */}

                                            <div>

                                                <h4 className="font-semibold mb-2">

                                                    Skills Wanted

                                                </h4>

                                                <div className="flex flex-wrap gap-2">

                                                    {
                                                        user.skills_wanted.map(
                                                            (
                                                                skill,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={index}
                                                                    className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                                                                >

                                                                    {skill}

                                                                </span>
                                                            )
                                                        )
                                                    }

                                                </div>

                                            </div>

                                            {/* CONNECT BUTTON */}

                                            <button
                                                onClick={() =>
                                                    sendRequest(
                                                        user.id
                                                    )
                                                }
                                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl transition-all duration-300 font-semibold"
                                            >

                                                Connect

                                            </button>

                                        </div>
                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
}

export default Dashboard;