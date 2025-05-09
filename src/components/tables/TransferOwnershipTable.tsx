'use client';
import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../../app/context/DarkModeContext';
import Image from 'next/image';
import { Admin } from '@/src/Types/Admin';

interface Props {
    headings: string[];
    admins: Admin[];
    handleSelectUser: (userId: string) => void;
    selectedUserId: string;
}

const TransferOwnershipTable: React.FC<Props> = ({ headings, admins, handleSelectUser, selectedUserId }) => {
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
                        {Array.isArray(admins) &&
                            admins.map((admin, index) => (
                                <tr
                                    onClick={() => console.log('User clicked', admin.id)}
                                    key={admin.id}
                                    className="border-b text-[12px] sm:text-[16px] cursor-pointer"
                                >
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[100px] whitespace-nowrap"
                                    >
                                        {admin.id}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary min-w-[100px] whitespace-nowrap"
                                    >
                                        {admin.name ? admin.name : "-"}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[100px] whitespace-nowrap"
                                    >
                                        {admin.email}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[100px] whitespace-nowrap"
                                    >
                                        {admin.role}
                                    </td>
                                    <td
                                        className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-[80px] whitespace-nowrap text-center"
                                    >
                                        <button
                                            onClick={() => handleSelectUser(admin._id)}
                                            className="cursor-pointer"
                                        >
                                            <Image
                                                src={
                                                    selectedUserId === admin._id
                                                        ? '/icons/selected-option.svg'
                                                        : '/icons/available-option.svg'
                                                }
                                                alt={selectedUserId === admin._id ? 'Selected' : 'Options'}
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