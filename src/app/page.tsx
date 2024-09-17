import Navbar from "@/components/navbar/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center w-[100%] min-h-screen">
                <p className="text-[24px] text-inputLabel font-semibold text-center">Welcome to your dashboard</p>
            </div>
        </>
    );
}
