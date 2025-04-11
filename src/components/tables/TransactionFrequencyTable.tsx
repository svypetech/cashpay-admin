'use client'
import React, { useEffect, useState } from "react";
import { useDarkMode } from "../../app/(auth)/signin/context/DarkModeContext";
import TransactionDetailsPopup from "../transaction/TransactionDetailsPopup";
// import TransactionFrequency from "../cards/TransactionFrequency";

interface Transaction {
    id: string;
    userId: string;
    currency: string;
    amount: number;
    status: string;
    timestamp: string;
}

interface Props {
    headings: string[];
    data: Transaction[];
}

const TransactionFrequencyTable: React.FC<Props> = ({ data, headings }) => {
    const { darkMode } = useDarkMode(); // Get dark mode state
    const [showDark, setShowDark] = useState(darkMode);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Delay state update slightly to enable smooth transition
        const timeout = setTimeout(() => setShowDark(darkMode), 100);
        return () => clearTimeout(timeout);
    }, [darkMode]);

    useEffect(() => {
        console.log("data", data)
    }, [])



    return (
        <div className={`flex-1 rounded-lg w-full sm:px-10 py-5`}>
            {/* Table */}
            <div className="rounded-lg overflow-hidden w-full">
                <table className="w-full text-left table-fixed min-w-30">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] sm:text-[16px] p-2 sm:p-4">
                            {headings.map((heading, index) => (
                                <th key={index} className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((transaction, index) => (
                                <tr
                                    onClick={() => setShowPopup(true)}
                                    key={index} className="border-b text-[12px] sm:text-[16px] cursor-pointer">
                                    <td className={`p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words`}>
                                        {transaction.id}
                                    </td>
                                    <td className={`p-2 sm:p-4 font-satoshi font-bold text-primary w-3/6 min-w-0 break-words`}>
                                        {transaction.userId}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words">
                                        {transaction.currency}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0">
                                        {transaction.amount}
                                    </td>
                                    <td className={`p-2 sm:p-4 font-satoshi w-1/6 min-w-0`}>
                                        <p className={`px-4 py-2 w-fit rounded-xl font-semibold ${transaction.status === "Pending" ? "text-[#727272] bg-[#72727233]" : "bg-[#71FB5533] text-[#20C000]" }`} >{transaction.status}</p>
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0">
                                        {transaction.timestamp}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <TransactionDetailsPopup showPopup={showPopup} onClose={() => setShowPopup(false)} />

        </div>
    );
};

export default TransactionFrequencyTable;