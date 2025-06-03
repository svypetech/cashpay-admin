import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/src/Types/User";

export default function useFetchUsers(currentPage: number, limit: number, sortBy?: string, status?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all?page=${currentPage}&limit=${limit}`;
      
        if (sortBy?.trim()) {
          url += `&sortBy=${sortBy}`;
        }
        
        if (status?.trim()) {
          url += `&filterStatus=${status}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setIsError(true);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit, sortBy, status]);

  return { users, totalPages, isLoading, isError, setUsers };
}