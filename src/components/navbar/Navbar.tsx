"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Button from "../ui/button";

const Navbar: React.FC = () => {
    const { status } = useSession();

    const router = useRouter();
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/signup");
    };

    useEffect(() => {
        if (status === "unauthenticated") router.push("/signup");
    }, [router, status]);

    if (status === "loading") return "loading...";

    return (
        <div className="w-full flex items-center justify-end pb-5 px-[5%] border-b border-gray-200">
            {/* <Button className="w-[100px]" onClick={() => router.push("/")}>
                Home
            </Button> */}
            <Button className="w-[100px]" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Navbar;
