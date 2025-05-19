import { Wallet } from "@/src/Types/Wallet";
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
  const [wallets, setWallets] = useState<Wallet[]>([]);
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
        
        // Start with base URL and required parameters
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/wallets/all?limit=${limit}&page=${currentPage}`;
        
        // Only add search parameter if it exists and isn't empty
        if (debouncedSearchQuery && debouncedSearchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(debouncedSearchQuery.trim())}`;
        }
        
        // Only add sort parameter if it exists and isn't empty
        if (sortBy && sortBy.trim() !== "") {
          url += `&sortBy=${encodeURIComponent(sortBy.trim())}`;
        }
          
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (response.status !== 200) {
          throw new Error("Failed to fetch wallets");
        }
        
        setWallets(response.data.walletsWithUser);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching wallets:", error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [currentPage, limit, sortBy, debouncedSearchQuery]);

  return { wallets, loading, isError, totalPages }; 
}