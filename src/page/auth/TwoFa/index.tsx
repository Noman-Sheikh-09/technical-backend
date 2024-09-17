"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useTwoFaEmail from "@/hooks/store/useTwoFaEmail";
import React, { useCallback, useState } from "react";

function TwoFa({ callbackUrl = process.env.NEXT_PUBLIC_BASE_URL }: { callbackUrl?: string }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const onReady = useCallback(() => {
        window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
            useTwoFaEmail.getState().email || "hello@example.com"
        )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
    }, [callbackUrl, code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) {
            setError("Code is required");
            return;
        }
        onReady();
    };

    return (
        <div className="bg-paper w-[100%] min-h-[100vh] flex items-center justify-center rounded-[6px]">
            <div className="w-[90%] md:w-[430px] bg-white p-[20px] sm:p-[24px] shadow-md">
                <p className="text-[18px] text-inputLabel font-medium">Enter your code</p>

                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Enter Code"
                        type="text"
                        label="Code"
                        className="mt-[24px]"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    {error && <p className="text-red-500 mt-[12px]">{error}</p>}

                    <Button type="submit" className="mt-[24px]">
                        Enter
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default TwoFa;
