import { useState, useEffect } from "react";
import { auth } from "../General/database/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import LogoFrame from "../General/logoFrame/logoFrame";

export const LoginPage = () => {
    const [email, setEmail] = useState(localStorage.getItem("savedEmail") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false); // Animation trigger
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (rememberMe) {
                localStorage.setItem("savedEmail", email);
            } else {
                localStorage.removeItem("savedEmail");
            }

            setIsLoggingIn(true); // Trigger animation

            // Wait for animation to complete
            setTimeout(() => {
                navigate("/Home");
            }, 600); // Match the duration of your CSS animation

        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    useEffect(() => {
        if (!rememberMe) {
            localStorage.removeItem("savedEmail");
        }
    }, [rememberMe]);

    return (
        <div className={`login-page ${isLoggingIn ? "fade-out" : ""}`}>
            <LogoFrame />
            <form className="login-form" onSubmit={handleLogin}>
                <div className="text-container">
                    <p className="login-subtitle">Track smarter. Work smoother.</p>
                </div>
                <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="input"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="remember-me-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="remember-me-checkbox"
                        />
                        Remember me
                    </label>
                </div>
                {error && <p className="error">Login failed, please try again</p>}
                <button type="submit" className="login-button">Sign in</button>
            </form>
        </div>
    );
};
