import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        await prisma.$connect();
        const { id, token } = await req.json();

        if (!id || !token) {
            return NextResponse.json({ message: "User ID and token is required" }, { status: 400 });
        }

        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                identifier_token: {
                    identifier: id,
                    token,
                },
            },
        });

        if (!verificationToken) return NextResponse.json({ message: "User ID or token is invalid" }, { status: 400 });

        const currentTime = new Date();
        const tokenExpirationTime = new Date(verificationToken?.expires);

        // Calculate the difference in hours
        const differenceInHours = (currentTime.getTime() - tokenExpirationTime.getTime()) / (1000 * 60 * 60);

        // Check if the token has expired or if the difference is exactly 1 hour
        if (differenceInHours >= 1) {
            return NextResponse.json({ message: "Verification token has expired" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id },
            data: { emailVerified: new Date() },
        });

        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: id,
                    token,
                },
            },
        });

        return NextResponse.json(
            { message: "Congratulations, you are verified", status: 200 },
            { status: 200 } // Correct status code for successful update
        );
    } catch (e) {
        const error = e as Error;
        console.error("[VERIFY_USER_ERROR]", error);
        return NextResponse.json({
            status: 500,
            message: "Internal server error: " + error.message,
        });
    } finally {
        await prisma.$disconnect(); // Ensure proper disconnection
    }
}
