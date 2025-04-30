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
        <div className="flex-1 rounded-lg w-full sm:px-10 py-5">
            <div className="rounded-lg overflow-auto w-full min-h-[200px]">
                <table className="w-full text-left table-auto min-w-[700px]">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] sm:text-[16px] py-3 sm:py-4 px-2 sm:px-4">
                            {headings.map((heading, index) => (
                                <th
                                    key={index}
                                    className={`px-2 sm:px-4 py-3 sm:py-4 text-left ${index === 0 ? 'w-[100px]' : index === 1 ? 'w-[100px]' : index === 2 ? 'w-[150px]' : index === 3 ? 'w-[100px]' : 'w-[80px]'}`}
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
                                    key={user.id}
                                    className="border-b text-[12px] sm:text-[16px] cursor-pointer"
                                >
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[100px] whitespace-nowrap"
                                    >
                                        {user.id}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary min-w-[100px] whitespace-nowrap"
                                    >
                                        {user.name}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[100px] whitespace-nowrap"
                                    >
                                        {user.email}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[100px] whitespace-nowrap"
                                    >
                                        {user.type}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[80px] whitespace-nowrap text-center"
                                    >
                                        <button
                                            onClick={() => handleSelectUser(user.id)}
                                            className="cursor-pointer"
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
                                                className="w-4 h-4 mx-auto"
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