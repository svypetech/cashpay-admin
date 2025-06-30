"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import TransactionManagementPopup from "../transaction/TransactionManagementPopup";

import ExpandableId from "../ui/ExpandableId";
import ColourfulBlock from "../ui/ColourfulBlock";
import Transaction from "@/src/Types/TransactionManagement";
import { timeAgo } from "@/src/lib/functions";

interface Props {
  headings: string[];
  data: Transaction[];
}

const TransactionTable: React.FC<Props> = ({ data, headings }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Simple dropdown logic: close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null) {
        const target = event.target as HTMLElement
        if (!target.closest(".dropdown-container")) {
          setActiveDropdown(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown])

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  // Function to get status display text and styling
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case "completed":
        return {
          text: "Success",
          className:
            "text-center rounded-xl text-xs md:text-base font-semibold bg-[#71FB5533] text-[#20C000]",
        };
      case "pending":
        return {
          text: "Pending",
          className:
            "text-center rounded-xl text-xs md:text-base font-semibold bg-[#72727233] text-[#727272]",
        };
      case "failed":
        return {
          text: "Failed",
          className:
            "text-center rounded-xl text-xs md:text-base font-semibold bg-[#FF000033] text-[#FF0000]",
        };
      default:
        return {
          text: status,
          className:
            "text-center rounded-xl text-xs md:text-base font-semibold bg-[#72727233] text-[#727272]",
        };
    }
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add padding bottom for dropdown space */}
      <div className="rounded-lg overflow-x-auto w-full pb-10" ref={tableRef}>
        <table className="w-full text-left table-auto">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className="px-2 md:px-4 py-3 md:py-4 text-left font-[700]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] md:text-[16px] hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi font-bold text-primary min-w-[100px] break-words">
                    <ExpandableId id={transaction.id || "N/A"} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId
                      id={transaction.web3Data?.transaction?.from || "N/A"}
                    />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">
                    <ExpandableId
                      id={transaction.web3Data?.transaction?.to || "N/A"}
                    />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">
                    {transaction.amount
                      ? `${transaction.amount} ${transaction.tokenName}`
                      : "N/A"}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                    {(() => {
                      const statusConfig = getStatusConfig(transaction.status);
                      return (
                        <ColourfulBlock
                          text={statusConfig.text}
                          className={statusConfig.className}
                        />
                      );
                    })()}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] font-medium">
                    {transaction.web3Data?.transaction?.blockNumber || "N/A"}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] whitespace-nowrap">
                    {timeAgo(transaction.date)}
                  </td>
                  <td className="relative p-2 md:p-4 font-satoshi min-w-[60px] text-center">
                    <div className="dropdown-container relative inline-block">
                      <button
                        className="relative cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-5 h-5"
                        />
                      </button>

                      {activeDropdown === index && (
                        <div className="absolute z-10 right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedTransaction(transaction)
                              setShowPopup(true)
                              setActiveDropdown(null)
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Popup */}
      <TransactionManagementPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)} // @ts-ignore
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionTable;