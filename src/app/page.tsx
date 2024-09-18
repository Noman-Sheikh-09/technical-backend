"use client";
import Navbar from "@/components/navbar/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface User {
    createdAt: Date;
    email: string;
    emailVerified: string;
    id: string;
    image: string;
    name: string;
    password: string;
    role: string;
    updatedAt: Date;
}

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log(session, "session");

    useEffect(() => {
        if (status === "loading") {
            return; // Do nothing while loading session
        }

        if (!session || !session.user) {
            router.push("/login");
            return;
        }
        const user = session.user as User;

        if (user.role == "ADMIN") {
            router.push("/adminDashboard");
            return;
        }
    }, [session, status, router]);
    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center w-[100%] min-h-screen">
                <p className="text-[24px] text-inputLabel font-semibold text-center">Welcome to your dashboard</p>
            </div>
        </>
    );
}
