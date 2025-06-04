"use client";
import React, { useState } from "react";

import TransactionDetailsPopup from "../transaction/TransactionDetailsPopup";
import Transaction from "@/src/Types/TransactionManagement";
import { formatJoiningDate, shortenAddress } from "@/src/lib/functions";
import { formatDate } from "date-fns";
interface Props {
  headings: string[];
  data: Transaction[];
}

const TransactionFrequencyTable: React.FC<Props> = ({ data, headings }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>({} as Transaction);

  // Function to get column width class based on heading index
  const getColumnWidthClass = (index: number): string => {
    switch (index) {
      case 0: // ID column
        return "w-[15%]";
      case 1: // User ID column
        return "w-[15%]";
      case 2: // Token Name column
        return "w-[18%]";
      case 3: // Amount column
        return "w-[12%]";
      case 4: // Status column
        return "w-[20%]";
      case 5: // Date column
        return "w-[20%]";
      default:
        return "w-[16.67%]"; // Default equal width
    }
  };

  return (
    <div className={`flex-1 rounded-lg w-full py-5`}>
      {/* Table */}
      <div className="rounded-lg overflow-x-auto w-full min-h-[200px]">
        <table className="w-full text-left table-auto min-w-[800px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] py-3 sm:py-4 px-2 sm:px-4">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-4 py-3 sm:py-4 text-left font-[700] ${getColumnWidthClass(index)}`}
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
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowPopup(true);
                  }}
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px] cursor-pointer"
                >
                  <td className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi ${getColumnWidthClass(0)}`}>
                    {shortenAddress(transaction.id)}
                  </td>
                  <td className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary min-w-0 break-words ${getColumnWidthClass(1)}`}>
                    {transaction.userId ? shortenAddress(transaction.userId) : "N/A"}
                  </td>
                  <td className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-0 break-words ${getColumnWidthClass(2)}`}>
                    {transaction.tokenName}
                  </td>
                  <td className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-0 ${getColumnWidthClass(3)}`}>
                    {transaction.amount}
                  </td>
                  <td className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi ${getColumnWidthClass(4)}`}>
                    <p
                      className={`px-4 py-2 w-fit rounded-xl font-semibold ${
                        transaction.status === "Pending"
                          ? "text-[#727272] bg-[#72727233]"
                          : "bg-[#71FB5533] text-[#20C000]"
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </td>
                  <td className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi ${getColumnWidthClass(5)}`}>
                    {formatJoiningDate(transaction.date)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <TransactionDetailsPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionFrequencyTable;