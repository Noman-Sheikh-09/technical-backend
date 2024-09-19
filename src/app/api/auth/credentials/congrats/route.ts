import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import CongratsEmail from "../../../../../../emails/CongratsEmail";
import { subMinutes } from "date-fns"; // You can use date-fns for manipulating dates

export async function POST() {
    return await sendCongratsEmail();
}

export async function GET() {
    return await sendCongratsEmail();
}

async function sendCongratsEmail() {
    try {
        await prisma.$connect();

        // Calculate the time that is exactly one hour ago
        // const oneHourAgo = subHours(new Date(), 1);
        const oneHourAgo = subMinutes(new Date(), 5);
        console.log(oneHourAgo, "oneHourAgo");
        // Find users who were verified more than 1 hour ago and haven't received a congratulatory email
        const usersToCongratulate = await prisma.user.findMany({
            where: {
                emailVerified: {
                    lte: oneHourAgo, // emailVerified is 1 hour ago or earlier
                },
                congratsEmail: false, // Only users who haven't received the email yet
            },
            select: {
                email: true,
                name: true,
                id: true,
            },
        });
        console.log(usersToCongratulate);

        if (usersToCongratulate.length === 0) {
            return NextResponse.json({ message: "No users found to congratulate" }, { status: 404 });
        }

        // Send congratulatory email to each user
        const emailPromises = usersToCongratulate.map(async (user) => {
            await resend.emails.send({
                to: user.email,
                from: process.env.EMAIL_FROM!,
                subject: "Congratulations on Verifying Your Email!",
                react: CongratsEmail({ name: user.name || "User" }),
            });

            // Update the user's congratsEmail to true
            await prisma.user.update({
                where: { id: user.id },
                data: { congratsEmail: true },
            });
        });

        // Wait for all emails to be sent
        await Promise.all(emailPromises);

        return NextResponse.json(
            { message: `Congratulations email sent to ${usersToCongratulate.length} user(s)` },
            { status: 200 }
        );
    } catch (error) {
        console.error("[SEND_CONGRATS_EMAIL_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
