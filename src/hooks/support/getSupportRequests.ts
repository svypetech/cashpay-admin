import { SupportRequest } from "@/src/Types/SupportRequests"
import axios from "axios"
import { useEffect, useState } from "react"
import { handleTokenExpiration } from "@/src/lib/functions"

interface Props {
    page: number
    limit: number
    sortBy?: string
    tab?: string // "assigned", "unassigned", or undefined for "all"
    search?: string // Optional search query
}

export default function useFetchSupportRequests({ page, limit, sortBy, tab, search }: Props) {
    const [requests, setRequests] = useState<SupportRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        setIsLoading(true)
        const fetchRequests = async () => {
            // Base URL
            let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/support-request/all?page=${page}&limit=${limit}`
            
            // Add sortBy parameter if provided
            if (sortBy?.trim()) {
                url += `&sortBy=${sortBy}`
            }

            if(search?.trim()) {
                url += `&search=${encodeURIComponent(search)}`
            }
            
            // Add status parameter based on tab
            if (tab === "assigned") {
                url += "&status=Assigned"
            } else if (tab === "unassigned") {
                url += "&status=Open"
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
    }, [page, limit, sortBy, tab, search]) // Added tab to dependency array to re-fetch when tab changes

    return { requests, totalPages, isLoading, error }
}