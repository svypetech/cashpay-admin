"use client";

import Image from "next/image";
import { Mail, Calendar } from "lucide-react";
import { formatNumberToTwoDecimals } from "@/src/lib/functions";

interface SellerBuyer {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  joinDate: string;
  id: number;
  _id: string;
  image: string;
  totalTrades: number;
  successRate: number;
}
interface BuyerDetailsCardProps {
  title?: string;
  user: SellerBuyer;
  buttonText: string;
  isResolved: boolean;
  onButtonClick?: () => void;
}

export default function DisputeDetailsCard({
  title = "Buyer Details",
  user,
  buttonText,
  onButtonClick = () => console.log("Button clicked"),
  isResolved,
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
              src={user.image ? user.image : "/placeholder.svg"}
              alt={`${name}'s profile picture`}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="font-medium text-center">
            {user.name.firstName + " " + user.name.lastName}
          </h3>
          <p className="text-xs text-gray-500">User ID: {user._id}</p>
        </div>

        {/* Right side - User info */}
        <div className="flex-1 ml-6 flex flex-col justify-start px-5">
          {/* Contact Info */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-4 items-center mb-5">
            <div className="flex items-center lg:col-span-2">
              <Image
                src="/icons/sms.svg"
                alt="Mail Icon"
                width={18}
                height={18}
                className="mr-2"
              />
              <span className="font-semibold text-sm">Email</span>
            </div>
            <span className="text-sm lg:col-span-4">{user.email}</span>

            <div className="flex items-center lg:col-span-2">
              <Image
                src="/icons/calendar.svg"
                alt="Calendar Icon"
                width={18}
                height={18}
                className="mr-2"
              />
              <span className="font-semibold text-sm">Joining</span>
            </div>
            <span className="text-sm lg:col-span-4">{user.joinDate}</span>
          </div>

          {/* Trade Stats*/}
          <div className="text-sm mb-2">
            <span className="font-bold">{user.totalTrades}</span> trades |{" "}
            <span className="font-bold">{formatNumberToTwoDecimals(user.successRate)}%</span> success rate
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 px-5">
        {isResolved ? (
          <p className="text-sm text-green-600 mb-2">
            This dispute has been resolved.
          </p>
        ) : (
          <button
            onClick={onButtonClick}
            className="rounded-md cursor-pointer border border-primary px-4 py-2 text-center text-primary font-semibold hover:bg-blue-50 min-w-[35%]"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}