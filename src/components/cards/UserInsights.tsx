import { formatNumberToTwoDecimals } from "@/src/lib/functions";
import Image from "next/image";
import Link from "next/link";
interface UserInsightsData {
  averageLoginPerUser: number;
  averageSession: number;
  activeUsers: number;
}

interface UserInsightsProps {
  userInsights: UserInsightsData;
}

export default function UserInsights({ userInsights }: UserInsightsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold font-[satoshi]">User Insights</h2>
        <Link href="/active-users">
          <img
            src="/icons/export-arrow.svg"
            alt="Arrow right"
            className="cursor-pointer sm:w-[24px] sm:h-[24px] w-[24px] h-[24px]"
          />
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-4 h-full">
        <div className="flex flex-col gap-2 col-span-3 h-full">
          {/* Avg Login/user */}
          <div className="p-4 border border-gray-200 rounded-lg h-[50%] flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <img
                src="/icons/user-insights1.svg"
                alt="login icon"
                className="sm:w-[55px] sm:h-[55px] w-[40px] h-[40px]"
              />
              <div>
                <div className="text-xs text-gray-500">Avg Login/user</div>
                <div className="text-2xl font-bold font-[satoshi] text-primary">
                  {formatNumberToTwoDecimals(userInsights?.averageLoginPerUser || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Avg Session */}
          <div className="p-4 border border-gray-200 rounded-lg h-[50%] flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <img
                src="/icons/user-insights2.svg"
                alt="session icon"
                className="sm:w-[55px] sm:h-[55px] w-[40px] h-[40px]"
              />
              <div>
                <div className="text-xs text-gray-500">Avg Session</div>
                <div className="text-2xl font-bold font-[satoshi] text-primary">
                  {formatNumberToTwoDecimals(userInsights?.averageSession || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="p-4 border border-gray-200 rounded-lg col-span-2 overflow-hidden">
          <div className="flex-col h-full">
            <div className="flex gap-3">
              <img
                src="/icons/user-insights3.svg"
                alt="login icon"
                className="sm:w-[55px] sm:h-[55px] w-[40px] h-[40px]"
              />
              <div className="flex flex-col justify-center text-sm text-gray-500">
                Active Users
              </div>
            </div>
            <div className="text-4xl font-bold font-[satoshi] text-primary flex items-center justify-center h-full">
              <p className="relative top-[-20px]">{userInsights?.activeUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
