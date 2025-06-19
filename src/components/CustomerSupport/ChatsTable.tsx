"use client";

import { formatJoiningDate, shortenAddress } from "@/src/lib/functions";
import { SupportRequest } from "@/src/Types/SupportRequests";
import Image from "next/image";
import type React from "react";
import { useState, useRef } from "react";
import ColourfulBlock from "../ui/ColourfulBlock";
import ExpandableId from "../ui/ExpandableId";

interface Props {
  headings: string[];
  chats: SupportRequest[];
}

const getStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "resolved":
      return {
        text: "Resolved",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#71FB5533] text-[#20C000]",
      };
    default:
      return {
        text: status,
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#EFE40833] text-[#B0A700]",
      };
  }
};

const ChatsTable: React.FC<Props> = ({ chats, headings }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChat, setSelectedChat] = useState<SupportRequest | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div
        className="rounded-lg overflow-x-auto w-full min-h-[150px]"
        ref={tableRef}
      >
        <table className="w-full text-left table-auto min-w-[600px] font-[satoshi]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className={`px-2 md:px-4 py-3 md:py-4 ${
                    heading === "Delivery Address" ? "text-center" : "text-left"
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(chats) &&
              chats.map((chat, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] md:text-[16px]"
                >
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">
                    <ExpandableId id={chat._id || "N/A"} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">
                    <ExpandableId id={chat.userId || "N/A"} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">
                    <ExpandableId id={chat.assignedTo || "N/A"} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">
                    {chat.issueType}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                    {(() => {
                      const statusConfig = getStatusConfig(chat.status);
                      return (
                        <ColourfulBlock
                          text={statusConfig.text}
                          className={statusConfig.className}
                        />
                      );
                    })()}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">
                    {formatJoiningDate(chat.updateDate)}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap underline text-primary cursor-pointer">
                    {`chat.cashpay/${chat._id}`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChatsTable;
