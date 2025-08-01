import { useEffect, useState } from "react";
import axios from "axios";
import { handleTokenExpiration } from "@/src/lib/functions";
type userInsights = {
    success: boolean,
    activeUsers: number,
    averageLoginPerUser: number,
    averageSession: number
}


export default function useFetchDashboardUsers() {
    const [userInsights, setuserInsights] = useState<userInsights>({} as userInsights);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/userInsignts`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setuserInsights(response.data);
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
    return { userInsights, isLoading, isError };
}