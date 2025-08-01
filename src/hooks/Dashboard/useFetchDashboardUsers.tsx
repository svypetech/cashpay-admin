import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardUser as User } from "@/src/Types/User";
import { handleTokenExpiration } from "@/src/lib/functions";

export default function useFetchDashboardUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/getUsers`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setUsers(response.data.users);
            } catch (error: any) {
                // Check if the error is due to unauthorized access (401)
                if (error.response?.status === 401 || 
                    error.response?.data?.statusCode === 401 ||
                    error.response?.data?.message?.includes("Invalid or expired token")) {
                  console.log("Token expired or invalid, redirecting to sign-in");
                  handleTokenExpiration();
                  return; // Don't set error state, just redirect
                }
                
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);
    return { users, isLoading, isError };
}