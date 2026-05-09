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

            const payload = {
                ...formData,
                skills_offered:
                    formData.skills_offered
                        .split(",")
                        .map(skill => skill.trim()),

                skills_wanted:
                    formData.skills_wanted
                        .split(",")
                        .map(skill => skill.trim())
            };

            await API.post(
                "/users/register",
                payload
            );

            alert("Registration Successful");

            navigate("/");

        } catch (error) {

            console.log(error);

            alert("Registration Failed");
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">

                <h1 className="text-4xl font-bold text-white text-center mb-2">
                    Create Account
                </h1>

                <p className="text-gray-300 text-center mb-8">
                    Join Synkly Today
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white/10 text-white border border-gray-500 outline-none focus:border-purple-400"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white/10 text-white border border-gray-500 outline-none focus:border-purple-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white/10 text-white border border-gray-500 outline-none focus:border-purple-400"
                    />

                    <input
                        type="text"
                        name="skills_offered"
                        placeholder="Skills Offered (comma separated)"
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white/10 text-white border border-gray-500 outline-none focus:border-purple-400"
                    />

                    <input
                        type="text"
                        name="skills_wanted"
                        placeholder="Skills Wanted (comma separated)"
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white/10 text-white border border-gray-500 outline-none focus:border-purple-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 text-white py-4 rounded-xl font-semibold"
                    >
                        Register
                    </button>

                </form>

                <p className="text-center text-gray-300 mt-6">
                    Already have an account?
                </p>

                <Link
                    to="/"
                    className="block text-center mt-2 text-purple-400 hover:text-purple-300"
                >
                    Login Here
                </Link>

            </div>

        </div>
    );
}

export default Register;