import { useState, useEffect } from "react";
import axios from "axios";
import {
  KycUserResponse,
  CompleteKycUser,
  NewKycUser,
  isCompleteKycUser,
  isNewKycUser,
} from "@/src/Types/KycUser";
import { handleTokenExpiration } from "@/src/lib/functions";

export default function useFetchKycUser(id: string) {
  const [user, setUser] = useState<CompleteKycUser | NewKycUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchKycUser = async () => {
        if(!id) {
            return;
        }

      setIsLoading(true);
      setIsError(false);

      try {

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kyc`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            id: id,
          },
        });

        // Handle different response structures
        if ("kycUser" in response.data.kycUser) {
          // This is the "new" status response
          setUser(response.data.kycUser.kycUser);
        } else {
          // This is the complete KYC data response
          setUser(response.data.kycUser);
        }
      } catch (error: any) {
        // Check if the error is due to unauthorized access (401)
        if (error.response?.status === 401 || 
            error.response?.data?.statusCode === 401 ||
            error.response?.data?.message?.includes("Invalid or expired token")) {
          console.log("Token expired or invalid, redirecting to sign-in");
          handleTokenExpiration();
          return; // Don't set error state, just redirect
        }
        
        console.error("Failed to fetch KYC user:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKycUser();
  }, [id]);

  return { user, isLoading, isError };
}
