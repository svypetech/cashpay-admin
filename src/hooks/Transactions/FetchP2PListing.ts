import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "date-fns";
import { handleTokenExpiration } from "@/src/lib/functions";
export default function useFetchP2PListing({
  currentPage,
  limit,
  searchQuery,
  addVisibility,
  sortBy,
}: {
  currentPage: number;
  limit: number;
  searchQuery?: string;
  addVisibility?: string;
  sortBy?: string;
}) {
  const [listings, setListings] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/add/p2pListing?page=${currentPage}&limit=${limit}`;
        if (debouncedSearchQuery !== "") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/add/p2pListing?page=${currentPage}&limit=${limit}&search=${debouncedSearchQuery}`;
        }
        if (sortBy !== "") {
          url += `&sortBy=${sortBy}`;
        }
        if (addVisibility !== "") {
          url += `&addVisibility=${addVisibility}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setListings(response.data.add.data);
        setTotalPages(response.data.add.totalPages);
        console.log("Total pages:", response.data.add.totalPages);
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
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [currentPage, debouncedSearchQuery, addVisibility, sortBy]);

  return { listings, totalPages, isLoading, isError, setListings };
}