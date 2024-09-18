import { SignJWT, jwtVerify } from "jose";

export const signJWT = async (payload: { sub: string }, options: { exp: string }) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "");
        const alg = "HS256";
        return new SignJWT(payload)
            .setProtectedHeader({ alg })
            .setExpirationTime(options.exp)
            .setIssuedAt()
            .setSubject(payload.sub)
            .sign(secret);
    } catch (error) {
        throw error;
    }
};

export const verifyJWT = async (token: string) => {
    if (!token) {
        return { success: false, error: true, message: "Your token has expired" };
    }
    try {
        const response = (await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY || "")))
            .payload as { sub: string };
        return { ...response, error: false, success: true };
    } catch (error) {
        return { success: false, error: true, message: "Your token has expired" };
    }
};

export const getUserId = async (token: string) => {
    try {
        const response = await verifyJWT(token);
        if (response.success && "sub" in response) {
            return {
                ...response,
                error: false,
                success: true,
                data: { id: response.sub },
            };
        }
        return response;
    } catch (error) {
        return {
            error: true,
            success: false,
            user: null,
            message: "Something went wrong",
        };
    }
};

export const getUserDetails = async (id: string) => {
    try {
        const response = await fetch(new URL(`/api/auth/getUser`, process.env.NEXT_PUBLIC_APP_URL), {
            method: "POST",ye
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return { ...data, error: false, success: true };
    } catch (error) {
        return { error: true, success: false, message: "Something went wrong" };
    }
};
