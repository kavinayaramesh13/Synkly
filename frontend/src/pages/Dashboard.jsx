import React, {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchMatches();

    }, []);

    const fetchMatches = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res = await API.get(
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

            alert("Failed to fetch matches");
        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (
        <div>

            <h1>Synkly Dashboard</h1>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h2>Your Skill Matches</h2>

            {
                matches.length === 0
                ? (
                    <p>No matches found</p>
                )
                : (
                    matches.map((user) => (

                        <div
                            key={user.id}
                            style={{
                                border: "1px solid black",
                                padding: "10px",
                                marginBottom: "10px"
                            }}
                        >

                            <h3>{user.name}</h3>

                            <p>
                                Email: {user.email}
                            </p>

                            <p>
                                Skills Offered:
                                {" "}
                                {
                                    user.skills_offered.join(", ")
                                }
                            </p>

                            <p>
                                Skills Wanted:
                                {" "}
                                {
                                    user.skills_wanted.join(", ")
                                }
                            </p>

                        </div>
                    ))
                )
            }

        </div>
    );
}

export default Dashboard;