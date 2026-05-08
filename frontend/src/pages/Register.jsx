import React, { useState } from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import API from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        skills_offered: "",
        skills_wanted: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post(
                "/users/register",
                {
                    ...formData,
                    skills_offered:
                        formData.skills_offered.split(","),

                    skills_wanted:
                        formData.skills_wanted.split(",")
                }
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert("Registration Failed");
        }
    };

    return (
        <div>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="skills_offered"
                    placeholder="Skills Offered"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="skills_wanted"
                    placeholder="Skills Wanted"
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Register
                </button>

            </form>

            <br />

            <Link to="/">
                Already have account? Login
            </Link>

        </div>
    );
}

export default Register;