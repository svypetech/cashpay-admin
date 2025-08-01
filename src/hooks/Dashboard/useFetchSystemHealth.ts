import { useState, useEffect } from "react";
import axios from "axios";
import { handleTokenExpiration } from "@/src/lib/functions";
export default function useFetchSystemHealth() {
  const [systemHealth, setSystemHealth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/systemHealth`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSystemHealth(response.data.health);
      } catch (error: any) {
        console.error("Error fetching system health:", error);
        
        // Check if the error is due to unauthorized access (401)
        if (error.response?.status === 401 || 
            error.response?.data?.statusCode === 401 ||
            error.response?.data?.message?.includes("Invalid or expired token")) {
          console.log("Token expired or invalid, redirecting to sign-in");
          handleTokenExpiration();
          return; // Don't set error state, just redirect
        }
        
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemHealth();
  }, []);

  return { systemHealth, isLoading, isError };
}
