import { InfoIcon as InfoCircle, Users, LogIn, Timer } from "lucide-react"
import Image from "next/image"

export default function UserInsights() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold font-[satoshi]">User Insights</h2>
        <Image
          src="/icons/export-arrow.svg"
          alt="Arrow right"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      </div>
      
        <div className="grid grid-cols-5 gap-4 h-full">
          <div className="flex flex-col gap-2 col-span-3 h-full">
            {/* Avg Login/user */}
            <div className="p-4 border border-gray-200 rounded-lg h-[50%] flex flex-col justify-center">
              <div className="flex items-start gap-3">
                <Image src="/icons/user-insights1.svg" alt="login icon" width={55} height={55} />
                <div>
                  <div className="text-xs text-gray-500">Avg Login/user</div>
                  <div className="text-2xl font-bold font-[satoshi] text-primary">400K</div>
                </div>
              </div>
            </div>

            {/* Avg Session */}
            <div className="p-4 border border-gray-200 rounded-lg h-[50%] flex flex-col justify-center">
              <div className="flex items-start gap-3">
                <Image src="/icons/user-insights2.svg" alt="session icon" width={55} height={55} />
                <div>
                  <div className="text-xs text-gray-500">Avg Session</div>
                  <div className="text-2xl font-bold font-[satoshi] text-primary">400K</div>
                </div>
              </div>
            </div>

          </div>

          {/* Active Users */}
          <div className="p-4 border border-gray-200 rounded-lg h-full col-span-2">
            <div className="flex-col">
              <div className="flex gap-3">
                <Image src="/icons/user-insights3.svg" alt="login icon" width={55} height={55} />
                <div className="flex flex-col justify-center text-sm text-gray-500">
                  Active Users
                </div>
              </div>
              <div className="text-4xl font-bold font-[satoshi] text-primary text-center mt-2">400K</div>
            </div>
          </div>

        </div>
    </div>
  )
}
