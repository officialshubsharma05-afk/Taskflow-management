import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await API.post(
                "/auth/register",
                formData
            );

            setSuccess(
                response.data.message ||
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Create Account</h1>
                <p className="auth-subtitle">
                    Join TaskFlow and manage your tasks.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label htmlFor="reg-name">Full Name</label>
                    <input
                        id="reg-name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="reg-email">Email Address</label>
                    <input
                        id="reg-email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="reg-password">Password (minimum 8 characters)</label>
                    <input
                        id="reg-password"
                        type="password"
                        name="password"
                        placeholder="Create a password (min. 8 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="8"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;
