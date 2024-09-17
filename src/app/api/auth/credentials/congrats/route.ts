import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import CongratsEmail from "../../../../../../emails/CongratsEmail";

export async function POST() {
    try {
        await prisma.$connect();

        // Find the most recent user based on the `createdAt` field
        const latestUser = await prisma.user.findFirst({
            orderBy: {
                createdAt: "desc", // Sort users by `createdAt` in descending order to get the most recent user
            },
            select: {
                email: true,
                name: true,
            },
        });
        console.log(latestUser);

        if (!latestUser) {
            return NextResponse.json({ message: "No users found" }, { status: 404 });
        }

        // Send congratulatory email to the latest user
        await resend.emails.send({
            to: latestUser.email,
            from: process.env.EMAIL_FROM!,
            subject: "Congratulations on Joining Us!",
            react: CongratsEmail({ name: latestUser.name || "User" }),
        });

        return NextResponse.json({ message: "Congratulations email sent to the latest user" }, { status: 200 });
    } catch (error) {
        console.error("[SEND_CONGRATS_EMAIL_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
