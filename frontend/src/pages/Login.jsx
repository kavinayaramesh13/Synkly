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

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert("Login Failed");
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">

                <h1 className="text-4xl font-bold text-white text-center mb-2">
                    Synkly
                </h1>

                <p className="text-gray-300 text-center mb-8">
                    Skill Exchange Platform
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white/10 text-white border border-gray-500 outline-none focus:border-blue-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white/10 text-white border border-gray-500 outline-none focus:border-blue-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-4 rounded-xl font-semibold"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center text-gray-300 mt-6">
                    Don't have an account?
                </p>

                <Link
                    to="/register"
                    className="block text-center mt-2 text-blue-400 hover:text-blue-300"
                >
                    Create Account
                </Link>

            </div>

        </div>
    );
}

export default Login;