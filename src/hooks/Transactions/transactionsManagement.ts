import { useEffect, useState } from 'react';
import axios from 'axios';
import Transaction from '@/src/Types/TransactionManagement';
  

const useFetchTransactions = ({page, limit, searchQuery, status, sortBy} : {page: number, limit: number, searchQuery?:string, status?: string, sortBy?: string})  => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Build base URL with search query if provided
        let url = searchQuery?.trim() 
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/transaction/?limit=${limit}&page=${page}&search=${searchQuery}` 
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/transaction/?limit=${limit}&page=${page}`;
        
        // Append status if provided
        if (status) {
          url += `&status=${status}`;
        }

        // Append sortBy if provided
        if (sortBy) {
          url += `&sort=${sortBy}`;
        }

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
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, limit, searchQuery, status, sortBy]);

  return { transactions, totalPages, loading, error };
};

export default useFetchTransactions;
