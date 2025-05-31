import { useState, useEffect } from "react";
import axios from "axios";
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
      } catch (error) {
        console.error("Error fetching system health:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemHealth();
  }, []);

  return { systemHealth, isLoading, isError };
}
