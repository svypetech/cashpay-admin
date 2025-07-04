import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/src/Types/User"

interface Props {
  currentPage: number;
  limit: number;
  sortBy?: string;
  status?: string
  search?: string
  startDate?: Date;
  endDate?: Date;
}

// Helper function to format date for backend API
const formatDateForBackend = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function useFetchUsers( {currentPage, limit, sortBy, status, search, startDate, endDate}: Props) {
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

        if(search?.trim()) {
          url += `&search=${search}`;
        }

        // Add date range parameters using local date format
        if (startDate) {
          url += `&startDate=${formatDateForBackend(startDate)}`;
        }

        if (endDate) {
          url += `&endDate=${formatDateForBackend(endDate)}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
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
  }, [currentPage, limit, sortBy, status, search, startDate, endDate]);

  return { users, totalPages, isLoading, isError, setUsers };
}