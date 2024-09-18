"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";

// Helper function to validate email format
const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

function Signup() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [errorMessage, setErrorMessage] = useState<string>(""); // Error message
    const [successMessage, setSuccessMessage] = useState<string>(""); // Success message
    const [isAdmin, setIsAdmin] = useState<boolean>(false); // State for admin checkbox

    const handleSubmit = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        // Basic form validation
        if (username.trim() === "") {
            setErrorMessage("Username is required");
            return;
        }
        if (!isValidEmail(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        const role = isAdmin ? "ADMIN" : "USER";
        const payload = {
            username,
            email,
            password,
            role: role,
        };
        setLoading(true);
        try {
            // Make the API call using fetch
            const response = await fetch("/api/auth/credentials/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create account");
            }

            await response.json();
            setSuccessMessage("Account created successfully!");

            // Clear form fields after successful signup
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setIsAdmin(false);
        } catch (e) {
            const error = e as Error;
            setErrorMessage(error.message || "Error creating account");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="bg-paper w-[100%] min-h-[100vh] flex items-center justify-center rounded-[6px]">
            <div className="w-[90%] md:w-[430px] bg-white p-[24px] shadow-md">
                <p className="text-[18px] text-inputLabel font-medium">Create account</p>

                {/* Display error message */}
                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                {/* Display success message */}
                {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

                <Input
                    placeholder="Username"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-[24px] "
                    disabled={loading}
                />
                <Input
                    placeholder="Email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-[24px]"
                    disabled={loading}
                />
                <Input
                    placeholder="********"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-[24px]"
                    disabled={loading}
                    showPasswordToggle={true} // Add password toggle for this field
                />
                <Input
                    placeholder="********"
                    type="password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-[24px]"
                    disabled={loading}
                    showPasswordToggle={true} // Add password toggle for this field
                />
                <div className="mt-[24px] flex items-center">
                    <input
                        type="checkbox"
                        id="adminCheckbox"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                        disabled={loading}
                        className="mr-2"
                    />
                    <label htmlFor="adminCheckbox" className="text-sm">
                        Sign up as Admin
                    </label>
                </div>
                <Button
                    onClick={handleSubmit}
                    className="mt-[24px]"
                    disabled={loading} // Disable button during loading
                >
                    {loading ? "Registering..." : "Register"}
                </Button>
                <p className="text-secondary text-[14px] font-regular mt-3">
                    Already have an account?{" "}
                    <Link href={"/login"} className="text-primary">
                        Signin
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
