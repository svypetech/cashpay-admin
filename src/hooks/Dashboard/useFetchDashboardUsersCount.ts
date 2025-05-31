import { useEffect, useState } from "react";
import axios from "axios";

type DashboardUserCount = {
  success: boolean;
  newUsers: number;
  inActiveUsers: number;
  activeUsers: number;
};

export default function useFetchDashboardUsersCount() {
  const [userCount, setUserCount] = useState<DashboardUserCount>(
    {} as DashboardUserCount
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserCount = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/userCount`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserCount(response.data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return { userCount, isLoading, isError };
}
