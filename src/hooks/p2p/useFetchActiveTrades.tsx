import Trade from "@/src/Types/Trades";
import axios from "axios";
import { useState, useEffect } from "react";

interface FetchActiveTradesParams {
  currentPage: number;
  limit: number;
  searchQuery: string;
  sortBy: string;
}

export default function useFetchActiveTrades({
  currentPage,
  limit,
  searchQuery,
  sortBy,
}: FetchActiveTradesParams) {
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
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
    const fetchActiveTrades = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/order/activeOrders?page=${currentPage}&limit=${limit}`;
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
        setActiveTrades(data.order);
        setTotalPages(data.totalPages);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveTrades();
  }, [currentPage, debouncedSearchQuery, sortBy]);

  return { setTrades: setActiveTrades, activeTrades, totalPages, isLoading, isError };
}