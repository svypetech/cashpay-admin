
import { MerchantBankAccount } from "@/src/Types/Merchant"
import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchAccounts(id: string) {
    const [accounts, setAccounts] = useState<MerchantBankAccount []>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<null| string>(null)


  useEffect(() => {
    setIsLoading(true)
    const fetchAccounts = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/card/merchantCards?createdBy=${id}&isMerchantCard=true`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        console.log("accounts fetched:", response.data);
        setAccounts(response.data.cards);

      } catch (error) {
        setError("Failed to fetch accounts")
        console.error("Error fetching accounts:", error)
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchAccounts() 
  }, [id]) // Re-run the effect when page, limit, or sortBy changes

  return { accounts, isLoading, error }
}