import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import VerifyEmail from "../../../../../../emails/VerifyEmail";
import { v4 as uuidv4 } from "uuid";

const generateVerificationToken = async (identifier: string) => {
    const token = uuidv4().toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const verificationToken = await prisma.verificationToken.create({
        data: {
            token,
            expires,
            identifier,
        },
    });
    return verificationToken;
};

export async function POST(req: Request) {
    try {
        await prisma.$connect();
        const body = await req.json();
        const { username, email, password, role } = body;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ message: "Password is required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email },
            select: { email: true, emailVerified: true },
        });

        if (existingUser && !!existingUser.emailVerified) {
            return NextResponse.json({ message: "Email Already Exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma?.user?.upsert({
            create: {
                name: username,
                email,
                password: hashedPassword,
                role: role.toUpperCase() as "USER" | "ADMIN",
            },
            where: { email },
            update: { name: username, password: hashedPassword, role: role.toUpperCase() as "USER" | "ADMIN" },
            select: { email: true, id: true },
        });

        const verificationToken = await generateVerificationToken(newUser.id);
        resend.emails.send({
            to: newUser.email,
            from: process.env.EMAIL_FROM!,
            subject: "Verify your account",
            react: VerifyEmail({
                href: `${process.env.NEXT_PUBLIC_BASE_URL}/verificationToken?token=${verificationToken.token}&id=${verificationToken.identifier}`,
            }),
        });

        return NextResponse.json({ user: newUser, message: "Verification email sent" }, { status: 201 });
    } catch (error) {
        console.error("[SIGNUP_USER_ERROR]", error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
