import { useEffect, useState } from "react";
import axios from "axios";
import { handleTokenExpiration } from "@/src/lib/functions";

export default function useFetchTransactionFrequency() {
  const [transactionFrequencyData, setTransactionFrequencyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTransactionFrequency = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/transaction/transactionFrequncy`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setTransactionFrequencyData(response.data.data);
      } catch (error: any) {
        if (
          error.response?.status === 401 ||
          error.response?.data?.statusCode === 401 ||
          error.response?.data?.message?.includes("Invalid or expired token")
        ) {
          console.log("Token expired or invalid, redirecting to sign-in");
          handleTokenExpiration();
          return;
        }
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionFrequency();
  }, []);

  return { transactionFrequencyData, isLoading, isError };
}
