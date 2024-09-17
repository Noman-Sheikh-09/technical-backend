import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTwoFaEmail = create(
    persist<{ email?: string; setEmail: (email: string) => void }>(
        (set) => ({
            email: "",
            setEmail(email) {
                set({ email });
            },
        }),
        { name: "two-fa-email" }
    )
);

export default useTwoFaEmail;
