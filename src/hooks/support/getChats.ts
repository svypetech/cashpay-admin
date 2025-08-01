import { SupportRequest } from "@/src/Types/SupportRequests"
import axios from "axios"
import { useEffect, useState } from "react"
import { handleTokenExpiration } from "@/src/lib/functions";

interface Props {
    page: number
    limit: number
    tab?: string
    search?: string
    startDate?: Date
    endDate?: Date
}

// Helper function to format date for backend API
const formatDateForBackend = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export default function useFetchChats({ page, limit, tab, search, startDate, endDate }: Props) {
    const [requests, setRequests] = useState<SupportRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        setIsLoading(true)
        const fetchRequests = async () => {
            // Base URL
            let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/support-request/all?page=${page}&limit=${limit}&assigned=true`
            
            if (search?.trim() && search !== "all") {
                url += `&search=${search}`
            }
            
            // Add status parameter based on tab
            if (tab === "pending") {
                url += "&status=Assigned"
            } else if (tab === "resolved") {
                url += "&status=Resolved"
            }

            // Add date range parameters using local date format
            if (startDate) {
            url += `&startDate=${formatDateForBackend(startDate)}`;
            }

            if (endDate) {
            url += `&endDate=${formatDateForBackend(endDate)}`;
            }

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                console.log("Requests fetched:", response.data);
                setRequests(response.data.requests.requests);
                setTotalPages(response.data.requests.totalPages)
            } catch (error: any) {
                // Check if the error is due to unauthorized access (401)
                if (error.response?.status === 401 || 
                    error.response?.data?.statusCode === 401 ||
                    error.response?.data?.message?.includes("Invalid or expired token")) {
                  console.log("Token expired or invalid, redirecting to sign-in");
                  handleTokenExpiration();
                  return; // Don't set error state, just redirect
                }
                
                setError("Failed to fetch requests")
                console.error("Error fetching requests:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchRequests()
    }, [page, limit, tab, search, startDate, endDate]) 

    return { requests, totalPages, isLoading, error }
}