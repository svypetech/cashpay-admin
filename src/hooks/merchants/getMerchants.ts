
import Merchant from "@/src/Types/Merchant"
import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchMerchants(page: number, limit: number, sortBy?: string) {
    const [merchants, setMerchants] = useState<Merchant []>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<null| string>(null)
    const [totalPages, setTotalPages] = useState(0)


  useEffect(() => {
    setIsLoading(true)
    const fetchmerchants = async () => {
      const url = sortBy?.trim() ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/merchant/Merchants?page=${page}&limit=${limit}&sortBy=${sortBy}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/merchant/Merchants?page=${page}&limit=${limit}`
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
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchmerchants() 
  }, [page, limit, sortBy]) // Re-run the effect when page, limit, or sortBy changes

  return { merchants, isLoading, error, totalPages }
}