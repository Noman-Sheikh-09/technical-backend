import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import crypto from "crypto";
import NextAuth from "next-auth";
import EmailProviders from "next-auth/providers/email";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface Session {
        user: {
            email: string;
            name: string;
            image?: string;
            role?: string; // Add role to the session user
        };
    }

    interface User {
        id: string;
        email: string;
        role?: string;
    }
}

const handler = NextAuth({
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/login",
    },
    providers: [
        EmailProviders({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            maxAge: 5 * 60,
            generateVerificationToken: async () => {
                const otp = crypto.randomInt(100000, 999999).toString();
                return otp;
            },
            sendVerificationRequest: (props) => {
                const { identifier: email, token, provider } = props;
                return new Promise((resolve, reject) => {
                    const { server, from } = provider;

                    nodemailer.createTransport(server).sendMail(
                        {
                            to: email,
                            from,
                            subject: `Authentication code: ${token}`,
                            html: `Your OTP code is ${token}`,
                        },
                        (error) => {
                            if (error) {
                                console.error("SEND_VERIFICATION_EMAIL_ERROR", email, error);
                                return reject(new Error(`SEND_VERIFICATION_EMAIL_ERROR ${error}`));
                            }

                            return resolve();
                        }
                    );
                });
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            // Fetch the user's role from the database
            const userRecord = await prisma.user.findUnique({
                where: { id: user.id },
                select: { role: true }, // Assuming the `role` field exists in your User model
            });

            // Add role to the session object
            session.user.role = userRecord?.role;

            return session;
        },
    },
});

export { handler as GET };

export async function POST(req: Request, res: Response) {
    if (req.url.endsWith("/signin/email")) {
        const cloneReq = req.clone();

        const form = await cloneReq.formData();
        const password = form.get("password");
        const email = form.get("email");

        if (typeof email !== "string" || typeof password !== "string")
            return NextResponse.json(
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/error?error=MISSING_FIELD`,
                    error: "MISSING_FIELD",
                    status: 400,
                    ok: false,
                },
                { status: 400 }
            );

        const user = await prisma.user.findUnique({
            where: { email },
            select: { password: true, emailVerified: true },
        });

        if (!user?.emailVerified) {
            return NextResponse.json(
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/error?error=INVALID_EMAIL`,
                    error: "INVALID_EMAIL",
                    status: 400,
                    ok: false,
                },
                { status: 400 }
            );
        }

        const isCorrectPassword = bcrypt.compareSync(password, user?.password ?? "");

        if (!isCorrectPassword)
            return NextResponse.json(
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/error?error=INVALID_PASSWORD`,
                    error: "INVALID_PASSWORD",
                    status: 400,
                    ok: false,
                },
                { status: 400 }
            );
    }

    return handler(req, res);
}
