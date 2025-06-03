import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardUser as User } from "@/src/Types/User";

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
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);
    return { users, isLoading, isError };
}