import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post(
                "/auth/login",
                formData
            );

            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user || {})
                );
                navigate("/dashboard");
            } else {
                setError("Login response missing authorization token.");
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>TaskFlow</h1>
                <p className="auth-subtitle">
                    Welcome back! Login to continue.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label htmlFor="login-email">Email Address</label>
                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
