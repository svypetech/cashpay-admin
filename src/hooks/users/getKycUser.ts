import { useState, useEffect } from "react";
import axios from "axios";
import {
  KycUserResponse,
  CompleteKycUser,
  NewKycUser,
  isCompleteKycUser,
  isNewKycUser,
} from "@/src/Types/KycUser";

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
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/kyc`;

        const response = await 
        
        
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kyc`, {
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
      } catch (error) {
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
