import { Admin } from "@/src/Types/Admin"
import axios from "axios"
import { set } from "date-fns"
import { useEffect, useState } from "react"

export default function useGetAdmins(page: number, limit: number, sortBy?: string) {
    const [admins, setAdmins] = useState<Admin []>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<null| string>(null)


  useEffect(() => {
    setIsLoading(true)
    const fetchAdmins = async () => {
      const url = sortBy?.trim() ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/?limit=${limit}&page=${page}&sortBy=${sortBy}` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/?limit=${limit}&page=${page}`
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        console.log("Admins fetched:", response.data);
        
        // filter the admin such that the current admin is not included in the list
        const user = localStorage.getItem("user")
        const currentAdmin = JSON.parse(user || "{}")
        const filteredAdmins = response.data.data.filter((admin: any) => admin._id !== currentAdmin._id)
        setAdmins(filteredAdmins)

      } catch (error) {
        setError("Failed to fetch admins")
        console.error("Error fetching admins:", error)
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchAdmins() 
  }, [page, limit, sortBy]) // Re-run the effect when page, limit, or sortBy changes

  return { admins, isLoading, error }
}