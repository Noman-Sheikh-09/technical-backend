import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import CongratsEmail from "../../../../../../emails/CongratsEmail";

export async function POST() {
    return await sendCongratsEmail();
}

export async function GET() {
    return await sendCongratsEmail();
}

async function sendCongratsEmail() {
    try {
        await prisma.$connect();

        // Find the most recent user based on the `createdAt` field
        const latestUser = await prisma.user.findFirst({
            where: {
                congratsEmail: false, // Check if the congratulatory email has not been sent
            },
            orderBy: {
                createdAt: "desc", // Get the most recent user
            },
            select: {
                email: true,
                name: true,
                id: true,
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
        // Update the user's congratsEmail to true
        await prisma.user.update({
            where: { id: latestUser.id },
            data: { congratsEmail: true },
        });
        return NextResponse.json({ message: "Congratulations email sent to the latest user" }, { status: 200 });
    } catch (error) {
        console.error("[SEND_CONGRATS_EMAIL_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
