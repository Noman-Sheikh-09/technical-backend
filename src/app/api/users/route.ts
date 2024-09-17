import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await prisma.$connect();

        // Calculate the date for the last 2 days

        const users = await prisma.user.findMany({
            where: {
                role: "USER",
            },
        });

        return NextResponse.json(
            { message: "ALl Users Fetch Successfully", status: 200, users: users },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("[FETCH_USERS_ERROR]", error);
        return NextResponse.json({
            status: 500,
            message: "Internal server error: " + error,
        });
    } finally {
        await prisma.$disconnect();
    }
}
