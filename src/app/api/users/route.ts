import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await prisma.$connect();

        const users = await prisma.user.findMany({
            where: {
                role: "USER",
            },
        });

        return NextResponse.json(
            { message: "All Users Fetched Successfully", status: 200, users: users },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                    "Surrogate-Control": "no-store",
                },
            }
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
