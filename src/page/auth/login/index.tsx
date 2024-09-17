"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useTwoFaEmail from "@/hooks/store/useTwoFaEmail";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        setIsLoading(true);
        try {
            const mail = email;
            const data = await signIn("email", {
                redirect: false,
                email: mail,
                password,
            });

            if (data?.error) return setError("Something went wrong. Please try again.");

            useTwoFaEmail.setState({ email: mail });
            router.push("/two-fa");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-paper w-[100%] min-h-[100vh] flex items-center justify-center rounded-[6px]">
            <div className="w-[90%] md:w-[430px] bg-white p-[20px] sm:p-[24px] shadow-md">
                <p className="text-[18px] text-inputLabel font-medium">Sign In</p>

                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Email"
                        type="email"
                        label="Email"
                        className="mt-[24px]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="********"
                        type="password"
                        label="Password"
                        className="mt-[24px]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPasswordToggle={true}
                    />
                    <Input
                        placeholder="********"
                        label="Confirm Password"
                        type="password"
                        className="mt-[24px]"
                        value={confirmPassword}
                        showPasswordToggle={true}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 mt-[12px]">{error}</p>}
                    {false && <p className="text-green-500 mt-[12px]">success</p>}

                    <Button type="submit" className="mt-[24px]" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Enter"}
                    </Button>
                    <p className="text-secondary text-[14px] font-regular mt-3">
                        Already have an account?{" "}
                        <Link href={"/signup"} className="text-primary">
                            Signup
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
