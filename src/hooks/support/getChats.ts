import { SupportRequest } from "@/src/Types/SupportRequests"
import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchChats(page: number, limit: number, tab?: string) {
    const [requests, setRequests] = useState<SupportRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        setIsLoading(true)
        const fetchRequests = async () => {
            // Base URL
            let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/support-request/all?page=${page}&limit=${limit}&assigned=true`
            
            // Add sortBy parameter if provided
            // if (sortBy?.trim() && sortBy !== "all") {
            //     url += `&sortBy=${sortBy}`
            // }
            
            // Add status parameter based on tab
            if (tab === "pending") {
                url += "&status=Assigned"
            } else if (tab === "resolved") {
                url += "&status=Resolved"
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
            } catch (error) {
                setError("Failed to fetch requests")
                console.error("Error fetching requests:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchRequests()
    }, [page, limit, tab]) 

    return { requests, totalPages, isLoading, error }
}