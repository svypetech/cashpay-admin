'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDarkMode } from "../../app/context/DarkModeContext";

interface User {
    id: string;
    name: string;
    lastLogin?: string;
    totalLogins?: number;
    sessionDuration?: string;
    loginFrequency?: string;
    timeSpent?: string;
    lastActivity?: string;
  }

interface Props {
    headings: string[];
    data: User[];
}

const UserTable: React.FC<Props> = ({ data, headings }) => {
    const { darkMode } = useDarkMode(); // Get dark mode state
    const [showDark, setShowDark] = useState(darkMode);

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
                            data.map((user, index) => (
                                <tr key={index} className="border-b text-[12px] sm:text-[16px]">
                                    <td className={`p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words`}>
                                        {user.id}
                                    </td>
                                    <td className={`p-2 sm:p-4 font-satoshi font-bold text-primary w-3/6 min-w-0 break-words`}>
                                        {user.name}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words">
                                        {user.lastLogin ? user.lastLogin : user.loginFrequency}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0">
                                        {user.totalLogins ? user.totalLogins : user.timeSpent}
                                    </td>
                                    <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0">
                                        {user.sessionDuration ? user.sessionDuration : user.lastActivity}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>


        </div>
    );
};

export default UserTable;