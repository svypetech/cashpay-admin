import { useEffect, useState } from 'react';
import axios from 'axios';
import Transaction from '@/src/Types/TransactionManagement';

interface Props {
  page: number;
  limit: number;
  searchQuery?: string;
  status?: string;
  sortBy?: string;
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

const useFetchTransactions = ({ page, limit, searchQuery, status, sortBy, startDate, endDate }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/transaction/?limit=${limit}&page=${page}`;
        
        // Add search query if provided
        if (searchQuery?.trim()) {
          url += `&search=${searchQuery}`;
        }
        
        // Add status if provided
        if (status?.trim()) {
          url += `&status=${status}`;
        }

        // Add sortBy if provided
        if (sortBy?.trim()) {
          url += `&sort=${sortBy}`;
        }

        // Add date range parameters using local date format
        if (startDate) {
          url += `&startDate=${formatDateForBackend(startDate)}`;
        }

        if (endDate) {
          url += `&endDate=${formatDateForBackend(endDate)}`;
        }

        console.log("Fetching transactions with URL:", url); // Debug log

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setTotalPages(response.data.totalPages);
        setTransactions(response.data.transactions);
        console.log("Fetched transactions:", response.data.transactions);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to fetch transactions");
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, limit, searchQuery, status, sortBy, startDate, endDate]);

  return { transactions, totalPages, loading, error, setTransactions };
};

export default useFetchTransactions;