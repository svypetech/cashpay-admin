import Trade from "@/src/Types/Trades";
import axios from "axios";
import { useState, useEffect } from "react";
import { handleTokenExpiration } from "@/src/lib/functions";

interface FetchActiveTradesParams {
  currentPage: number;
  limit: number;
  searchQuery: string;
  sortBy: string;
  status: "disputed" | "stuck";
}

export default function useFetchInactiveTrades({
  currentPage,
  limit,
  searchQuery,
  sortBy,
  status,
}: FetchActiveTradesParams) {
  const [inactiveTrades, setInactiveTrades] = useState<Trade[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchInactiveTrades = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/order/reportedOrders?page=${currentPage}&limit=${limit}`;
        if (status) {
          url += `&status=${status}`;
        }
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }
        if (sortBy) {
          url += `&sort=${sortBy}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.data;
        setInactiveTrades(data.order);
        setTotalPages(data.totalPages);
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

    fetchInactiveTrades();
  }, [currentPage, debouncedSearchQuery, sortBy]);

  return {
    setTrades: setInactiveTrades,
    inactiveTrades,
    totalPages,
    isLoading,
    isError,
  };
}
// Compare this snippet from src/components/p2pTrading/P2PActiveTrading.tsx: