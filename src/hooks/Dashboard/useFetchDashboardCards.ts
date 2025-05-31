import axios from "axios";
import { useEffect, useState } from "react";
type DashboardCards = {
    success: string;
    userCount: number;
    tradeCount: number;
    transactionCount: number;
    cardCount: number;
};
export default function useFetchDashboardCards() {
  const [dashboardCards, setDashboardCards] = useState<DashboardCards >({} as DashboardCards);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchDashboardCards = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/dashboardCards`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDashboardCards(response.data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardCards();
  }, []);

  return { dashboardCards, isLoading, isError };
}