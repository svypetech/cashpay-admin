import { useEffect, useState } from "react";
import axios from "axios";
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
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);
    return { userInsights, isLoading, isError };
}