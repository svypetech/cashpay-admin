'use client'
import React, { useEffect, useState } from "react";
import { useDarkMode } from "../../app/context/DarkModeContext";
import { Token } from "@/src/types/types";

interface TokenTableProps {
    tokens: Token[];
    filter: string;
}

const TokenTable: React.FC<TokenTableProps> = ({ tokens, filter }) => {
    const { darkMode } = useDarkMode(); // Get dark mode state
    const [showDark, setShowDark] = useState(darkMode);

    useEffect(() => {
        const timeout = setTimeout(() => setShowDark(darkMode), 100);
        return () => clearTimeout(timeout);
    }, [darkMode]);

    // Filter tokens based on the provided filter text (case-insensitive)
    const filteredTokens = tokens.filter(token =>
        token.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex-1 rounded-lg shadow-lg w-full" style={{ boxShadow: "0px 0px 12px 2px rgba(0, 0, 0, 0.06)" }}>
            <div className="shadow-md rounded-lg overflow-hidden w-full">
                <table className="w-full text-left table-fixed min-w-30">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] sm:text-[16px] p-2 sm:p-4">
                            <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Token</th>
                            <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Current Price</th>
                            <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Total Supply</th>
                            <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Total Volume</th>
                            <th className="p-2 sm:p-4 text-left w-1/5 sm:w-3/6">Price Change 24h</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTokens.length > 0 ? (
                            filteredTokens.map((token, index) => (
                                <tr key={index} className="border-b text-[12px] sm:text-[16px]">
                                    <td className={`p-2 sm:p-4 font-satoshi ${showDark ? "text-secondary" : "text-primary"} font-semibold w-2/6 min-w-0 break-words`}>
                                        {token.name}
                                    </td>
                                    <td className={`p-2 sm:p-4 font-satoshi ${showDark ? "text-secondary" : "text-primary"} w-3/6 min-w-0 break-words`}>
                                        {token.current_price}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words">
                                        {token.total_supply}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0 break-words">
                                        {token.total_volume}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0 break-words">
                                        {token.price_change_24h}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    No tokens found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TokenTable;
