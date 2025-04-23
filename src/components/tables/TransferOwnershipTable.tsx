'use client';
import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../../app/context/DarkModeContext';
import Image from 'next/image';

interface User {
    id: string;
    name: string;
    email: string;
    type: string;
}

interface Props {
    headings: string[];
    users: User[];
    handleSelectUser: (userId: string) => void;
    selectedUserId: string;
}

const TransferOwnershipTable: React.FC<Props> = ({ headings, users, handleSelectUser, selectedUserId }) => {
    const { darkMode } = useDarkMode();
    const [showDark, setShowDark] = useState(darkMode);

    useEffect(() => {
        const timeout = setTimeout(() => setShowDark(darkMode), 100);
        return () => clearTimeout(timeout);
    }, [darkMode]);

    return (
        <div className={`flex-1 rounded-lg w-full sm:px-10 py-5`}>
            <div className="rounded-lg overflow-hidden w-full">
                <table className="w-full text-left table-fixed min-w-30">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] sm:text-[16px] p-2 sm:p-4">
                            {headings.map((heading, index) => (
                                <th
                                    key={index}
                                    className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) &&
                            users.map((user, index) => (
                                <tr
                                    onClick={() => console.log('User clicked', user.id)}
                                    key={user.id} // Use unique user.id instead of index
                                    className="border-b text-[12px] sm:text-[16px] cursor-pointer"
                                >
                                    <td
                                        className={`p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words`}
                                    >
                                        {user.id}
                                    </td>
                                    <td
                                        className={`p-2 sm:p-4 font-satoshi font-bold text-primary w-3/6 min-w-0 break-words`}
                                    >
                                        {user.name}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words"
                                    >
                                        {user.email}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0"
                                    >
                                        {user.type}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0 relative"
                                    >
                                        <button
                                            onClick={() => handleSelectUser(user.id)}
                                            className="absolute right-0 md:relative md:right-auto cursor-pointer"
                                        >
                                            <Image
                                                src={
                                                    selectedUserId === user.id
                                                        ? '/icons/selected-option.svg'
                                                        : '/icons/available-option.svg'
                                                }
                                                alt={selectedUserId === user.id ? 'Selected' : 'Options'}
                                                width={24}
                                                height={24}
                                                className="w-4 h-4"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransferOwnershipTable;