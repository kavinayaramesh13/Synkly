import React, { useState } from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
                "/users/login",
                formData
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert("Login Failed");
        }
    };

    return (
        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

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

                <button type="submit">
                    Login
                </button>

            </form>

            <br />

            <Link to="/register">
                Don't have account? Register
            </Link>

        </div>
    );
}

export default Login;