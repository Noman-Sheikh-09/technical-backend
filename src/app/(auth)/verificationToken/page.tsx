"use client";

import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThreeCircles } from "react-loader-spinner";

function VerificationToken({ searchParams: { id, token } }: { searchParams: { token?: string; id?: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const postdata = async () => {
            if (id && token) {
                try {
                    const response = await fetch(`/api/auth/credentials/verifyuser`, {
                        method: "POST",
                        body: JSON.stringify({ id, token }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    await response.json();

                    if (response.status == 200) {
                        setLoading(false);
                    } else {
                        setLoading(true);
                    }
                } catch (error) {
                    console.error("Error verifying token:", error);
                    setLoading(false);
                }
            }
        };
        postdata();
    }, [id, token]);

    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center h-lvh bg-paperColor dark:bg-darkSecondary">
                    <ThreeCircles
                        visible={true}
                        height="70"
                        width="70"
                        ariaLabel="three-circles-loading"
                        wrapperStyle={{}}
                        wrapperClass="vortex-wrapper"
                        color="#3B82F6"
                    />
                </div>
            ) : (
                <div className="bg-paperColor flex flex-col justify-center items-center gap-0 min-h-[100vh]">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-lightPrimary text-5xl font-bold">Verified</p>
                        <p className="text-dark text-3xl font-bold">Congratulations!</p>
                        <p className="text-xl text-gray-500">Your account has been verified. Please click Continue</p>
                    </div>
                    {/* <img src="/auth/verified.png" alt="Not Found" className="w-[20%]" /> */}
                    <Button className="w-[200px] " onClick={() => router.push("/login")}>
                        Continue
                    </Button>
                </div>
            )}
        </div>
    );
}

export default VerificationToken;
