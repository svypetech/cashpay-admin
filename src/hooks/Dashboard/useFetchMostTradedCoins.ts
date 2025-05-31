import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetchMostTradedCoins() {
  const [mostTradedCoins, setmostTradedCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchmostTradedCoins = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/trendingCoins`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setmostTradedCoins(response.data.tokens);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchmostTradedCoins();
  }, []);

  return { mostTradedCoins, isLoading, isError };
}