import React from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/requests"
                    element={<Requests />}
                />

                <Route
                    path="/sessions"
                    element={<Sessions />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;