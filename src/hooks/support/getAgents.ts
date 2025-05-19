


import { Agent } from "@/src/Types/Agent"
import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchAgents(page: number, limit: number) {
    const [agents, setAgents] = useState<Agent []>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [error, setError] = useState<null| string>(null)


  useEffect(() => {
    setIsLoading(true)
    const fetchagents = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/support-request/allAgents?page=${page}&limit=${limit}`
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setAgents(response.data.data);
        setTotalPages(response.data.totalPages)

      } catch (error) {
        setError("Failed to fetch agents")
        console.error("Error fetching agents:", error)
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchagents() 
  }, [page, limit]) // Re-run the effect when page, limit, or sortBy changes

  return { agents, isLoading, error, totalPages }
}