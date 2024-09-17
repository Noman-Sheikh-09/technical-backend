"use client";
import Loader from "@/components/loader";
import { Table, TableBody, TableRow, TableCell } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    createdAt: Date;
    email: string;
    emailVerified: string;
    id: string;
    image: string;
    name: string;
    password: string;
    role: string;
    updatedAt: Date;
}

const Dashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();
    const router = useRouter();
    console.log(session, "session");

    useEffect(() => {
        if (status === "loading") {
            return; // Do nothing while loading session
        }

        if (!session || !session.user) {
            router.push("/login");
            return;
        }

        // If user is not admin or not logged in, redirect them
        // @ts-ignore
        if (session.user.role !== "ADMIN") {
            router.push("/");
            return;
        }
    }, [session, status, router]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                setUsers(data?.users);
            } catch (error) {
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
    const activeUsersCount = users.filter((user: User) => user.emailVerified !== null).length;
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return error;
    }
    return (
        <div className="w-full min-h-screen p-[20px] sm:p-[40px] bg-paper">
            <p className="text-inputLabel text-[18px] font-semibold ">Dashboard</p>
            <p className="text-secondary text-[14px] font-regular ">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
            </p>
            <div className="w-[100%] flex-col flex sm:flex-row items-center justify-between gap-5 mt-[24px] ">
                <div className="w-[100%] sm:w-[50%] bg-white h-[104px] shadow-sm border border-gray-100 flex flex-col items-start p-5 justify-center rounded-[8px]">
                    <p className="text-[14px] text-secondary ">Total Users</p>
                    <p className="text-[30px] text-inputLabel font-semibold">{users?.length}</p>
                </div>
                <div className="w-[100%] sm:w-[50%] bg-white h-[104px] shadow-sm border border-gray-100 rounded-[8px] flex flex-col items-start justify-center p-5 roudned-[8px]">
                    <p className="text-[14px] text-secondary ">Active Users</p>
                    <p className="text-[30px] text-inputLabel font-semibold">{activeUsersCount}</p>
                </div>
            </div>
            <div className="p-6 shadow-sm border bg-white border-gray-100 roudned-[8px] mt-[24px] rounded-[8px]">
                <p className="text-inputLabel text-[18px] font-medium">List of users</p>
                <div className="mt-[16px] p-[12px]">
                    <Table>
                        <TableRow className="h-[58px] flex items-center justify-between">
                            <TableCell className="text-[14px] text-inputLabel font-semibold w-[10%]">Name</TableCell>
                            <TableCell className="text-[14px] text-inputLabel font-semibold w-[80%]">Mail</TableCell>
                            <TableCell className="text-[14px] text-inputLabel font-semibold max-w-[10%] text-center">
                                Status
                            </TableCell>
                        </TableRow>
                        <TableBody>
                            {users?.map((item: User) => (
                                <TableRow
                                    key={item.id}
                                    className="h-[58px] border-b border-gray-200 flex items-center justify-between"
                                >
                                    <TableCell className="text-[14px] font-normal text-secondary w-[10%]">
                                        {item.name}
                                    </TableCell>
                                    <TableCell className="text-[14px] font-normal text-secondary w-[80%]">
                                        {item.email}
                                    </TableCell>
                                    <TableCell
                                        className={`text-[14px] max-w-[10%] font-normal ${item?.emailVerified != null ? "text-[#166534] bg-[#DCFCE7] border border-[#BBF7D0] rounded-[6px] px-[8px] py-[3px]" : "text-[#1D4ED8] bg-[#BFDBFE] border border-[#1D4ED8] rounded-[6px] px-[8px] py-[3px]"} `}
                                    >
                                        {item.emailVerified != null ? "Active" : "Pending"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
