import Merchant from "@/src/Types/Merchant"
import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchMerchants(page: number, limit: number, sortBy?: string, status?: string, search?: string) {
    const [merchants, setMerchants] = useState<Merchant []>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<null| string>(null)
    const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    const fetchmerchants = async () => {
      // Build base URL with pagination
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/merchant/Merchants?page=${page}&limit=${limit}`
      
      // Add sortBy parameter if provided
      if (sortBy?.trim()) {
        url += `&sortBy=${sortBy}`
      }
      
      // Add status parameter if provided
      if (status?.trim()) {
        url += `&filterStatus=${status}`
      }

      if (search?.trim()) {
        url += `&search=${encodeURIComponent(search)}`
      }

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        console.log("merchants fetched:", response.data);
        setMerchants(response.data.merchants);
        setTotalPages(response.data.totalPages);

      } catch (error) {
        setError("Failed to fetch merchants")
        console.error("Error fetching merchants:", error)
        setMerchants([]);
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchmerchants() 
  }, [page, limit, sortBy, status, search]) // Re-run the effect when page, limit, sortBy, or status changes

  return { merchants, isLoading, error, totalPages, setMerchants }
}