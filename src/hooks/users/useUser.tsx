import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/src/Types/User";

export default function useUser(currentPage: number,limit: number, sortBy?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        const url = sortBy?.trim() ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all?page=${currentPage}&limit=${limit}&sortBy=${sortBy}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all?page=${currentPage}&limit=${limit}`;
        const response = await axios.get(url,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        
        setIsError(true);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage,sortBy]);

  return { users, totalPages, isLoading, isError ,setUsers};
}