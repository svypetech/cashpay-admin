import { Admin } from "@/src/Types/Admin"
import axios from "axios"
import { useEffect, useState } from "react"
import { handleTokenExpiration } from "@/src/lib/functions"

export default function useGetAdmins(page: number, limit: number, sortBy?: string, role?: string, search?: string) {
    const [admins, setAdmins] = useState<Admin []>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<null| string>(null)
    const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    const fetchAdmins = async () => {
      // Build URL with conditional parameters
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/?limit=${limit}&page=${page}`;
      
      // Add sortBy parameter if it exists and is not empty
      if (sortBy?.trim()) {
        url += `&sortBy=${sortBy}`;
      }
      
      // Add role parameter if it exists and is not empty
      if (role?.trim()) {
        url += `&role=${role}`;
      }

      // Add search parameter if it exists and is not empty
      if (search?.trim()) {
        url += `&search=${encodeURIComponent(search)}`;
      }

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
        const filteredAdmins = response.data.data.users.filter((admin: any) => admin ? admin._id !== currentAdmin._id : [])
        setAdmins(filteredAdmins)
        
        setTotalPages(Math.ceil(response.data.data.totalCount/ limit))
      } catch (error: any) {
        console.error("Error fetching admins:", error)
        
        // Check if the error is due to unauthorized access (401)
        if (error.response?.status === 401 || 
            error.response?.data?.statusCode === 401 ||
            error.response?.data?.message?.includes("Invalid or expired token")) {
          console.log("Token expired or invalid, redirecting to sign-in");
          handleTokenExpiration();
          return; // Don't set error state, just redirect
        }
        
        setError("Failed to fetch admins")
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchAdmins() 
  }, [page, limit, sortBy, role, search]) // Add router to dependency array

  return { admins, isLoading, error, totalPages }
}