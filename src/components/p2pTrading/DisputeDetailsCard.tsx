"use client"

import Image from "next/image"
import { Mail, Calendar } from "lucide-react"

interface BuyerDetailsCardProps {
  title?: string
  avatarUrl: string
  name: string
  userId: string
  email: string
  joiningDate: string
  tradeCount: number
  successRate: number
  buttonText: string
  onButtonClick?: () => void
}

export default function DisputeDetailsCard({
  title = "Buyer Details",
  avatarUrl,
  name,
  userId,
  email,
  joiningDate,
  tradeCount,
  successRate,
  buttonText,
  onButtonClick = () => console.log("Button clicked"),
}: BuyerDetailsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 px-5">{title}</h2>

      <div className="flex px-5">
        {/* Left side - Avatar and name */}
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full overflow-hidden mb-2">
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={`${name}'s profile picture`}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="font-medium text-center">{name}</h3>
          <p className="text-xs text-gray-500">User ID: {userId}</p>
        </div>

        {/* Right side - User info */}
        <div className="flex-1 ml-6 flex flex-col justify-start px-5">
          {/* Contact Info */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-4 items-center mb-5">
            <div className="flex items-center lg:col-span-2">
              <Image src="/icons/sms.svg" alt="Mail Icon" width={18} height={18} className="mr-2" />
              <span className="font-semibold text-sm">Email</span>
            </div>
            <span className="text-sm lg:col-span-4">{email}</span>

            <div className="flex items-center lg:col-span-2">
              <Image src="/icons/calendar.svg" alt="Calendar Icon" width={18} height={18} className="mr-2" />
              <span className="font-semibold text-sm">Joining</span>
            </div>
            <span className="text-sm lg:col-span-4">{joiningDate}</span>
          </div>

          {/* Trade Stats*/}
          <div className="text-sm mb-2">
            <span className="font-bold">{tradeCount}</span> trades | <span className="font-bold">{successRate}%</span> success rate
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 px-5">
        <button
          onClick={onButtonClick}
          className="rounded-md cursor-pointer border border-primary px-4 py-2 text-center text-primary font-semibold hover:bg-blue-50"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}