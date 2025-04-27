'use client'
import React, { useEffect, useState } from "react";
import { useDarkMode } from "../../app/context/DarkModeContext";
import UserProfileSidebar from "../users/UserInfoSidebar";

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

const ActiveUsersTable: React.FC<Props> = ({ data, headings }) => {
    const { darkMode } = useDarkMode(); // Get dark mode state
    const [showDark, setShowDark] = useState(darkMode);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        // Delay state update slightly to enable smooth transition
        const timeout = setTimeout(() => setShowDark(darkMode), 100);
        return () => clearTimeout(timeout);
    }, [darkMode]);

    useEffect(() => {
        console.log("data", data)
    }, []);

    return (
        <div className={`flex-1 rounded-lg w-full sm:px-10 py-5`}>
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full min-h-[200px]">
                <table className="w-full text-left table-fixed min-w-[600px]">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] sm:text-[16px] py-3 sm:py-4 px-2 sm:px-4">
                            {headings.map((heading, index) => (
                                <th key={index} className="px-2 sm:px-4 py-3 sm:py-4 text-left w-1/5 sm:w-2/6">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((user, index) => (
                                <tr
                                    onClick={() => setShowSidebar(true)}
                                    key={index}
                                    className="border-b text-[12px] sm:text-[16px] cursor-pointer"
                                >
                                    <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi w-2/6 min-w-0 break-words">
                                        {user.id}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary w-3/6 min-w-0 break-words">
                                        {user.name}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi w-2/6 min-w-0 break-words">
                                        {user.lastLogin ? user.lastLogin : user.loginFrequency}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi w-[120px] min-w-0">
                                        {user.totalLogins ? user.totalLogins : user.timeSpent}
                                    </td>
                                    <td
                                        className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi ${
                                            user.lastActivity ? "w-[150px]" : "w-1/6 min-w-0"
                                        }`}
                                    >
                                        {user.sessionDuration ? user.sessionDuration : user.lastActivity}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <UserProfileSidebar showSidebar={showSidebar} onClose={() => setShowSidebar(false)} />
        </div>
    );
};

export default ActiveUsersTable;