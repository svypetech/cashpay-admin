import axios from "axios";
import { useEffect, useState } from "react";

export default function useWallet({
  currentPage,
  limit,
  sortBy,
  searchQuery
}: {
  currentPage: number,
  limit: number,
  sortBy: string,
  searchQuery: string
}) {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce only the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Main data fetching effect
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const url = debouncedSearchQuery !== ""
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/wallets/all?limit=${limit}&page=${currentPage}&search=${debouncedSearchQuery}&sortBy=${sortBy}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/wallets/all?limit=${limit}&page=${currentPage}&sortBy=${sortBy}`;
          
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (response.status !== 200) {
          throw new Error("Failed to fetch wallets");
        }
        
        const data = response.data;
        setWallets(data);
        setTotalPages(5);
      } catch (error) {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [currentPage, limit, sortBy, debouncedSearchQuery]);

  return { wallets, loading, isError, totalPages }; 
}