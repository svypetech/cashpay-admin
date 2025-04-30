'use client';
import Image from 'next/image';
import { useState } from 'react';
import TransferOwnershipTable from '../tables/TransferOwnershipTable';
import ConfirmDialog from './ConfirmDialog';


const headings = ['Agent ID', 'Name', 'Email', 'Type', 'Actions'];
const users = [
    {
        id: 'ID#CP-9203',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9204',
        name: 'Jane Smith',
        email: 'janesmith@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9205',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9206',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9207',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9208',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9209',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9210',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9211',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
    {
        id: 'ID#CP-9212',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        type: 'Financial Manager',
    },
];

interface User {
    id: string;
    name: string;
    email: string;
    type: string;
}

interface TransferOwnershipDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: (newOwnerEmail: string) => void;
    isLoading?: boolean;
}

export default function TransferOwnershipDialog({
    isOpen,
    onCancel,
    onConfirm,
    isLoading = false,
}: TransferOwnershipDialogProps) {
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [error, setError] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSelectUser = (userId: string) => {
        setSelectedUserId(userId)
    };

    const handleSubmit = () => {
        if (!selectedUserId || selectedUserId === "") {
            setError('Please select a user');
            return;
        }
        console.log(`Ownership transferred to ${selectedUserId}`);
        setShowConfirmDialog(true);
        setError('');
    };

    const handleConfirmChange = async () => {
        setIsSubmitting(true);
        setShowConfirmDialog(false);
        // Simulate API call to transfer ownership
        console.log("Transferring ownership to:", selectedUserId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onConfirm(selectedUserId); // Call the onConfirm prop with the selected user ID
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-lg max-w-[900px] w-full max-h-[90vh] flex flex-col p-6"
                role="dialog"
                aria-labelledby="transfer-ownership-title"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3
                        id="transfer-ownership-title"
                        className="text-2xl font-bold"
                    >
                        Transfer Ownership
                    </h3>
                    <button
                        onClick={onCancel}
                        className="cursor-pointer"
                        aria-label="Close dialog"
                    >
                        <Image
                            src="/icons/close.svg"
                            alt="Close button icon"
                            width={20}
                            height={20}
                            className="h-4 w-4 hover:scale-105"
                        />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    <TransferOwnershipTable users={users} headings={headings} selectedUserId={selectedUserId} handleSelectUser={handleSelectUser} />
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex justify-between mt-2 w-full gap-4 px-5">
                    <button
                        onClick={onCancel}
                        className="rounded-md w-[50%] border px-6 py-2 border-[#DF1D1D] text-[#DF1D1D] hover:bg-red-50 cursor-pointer font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedUserId || selectedUserId === "" || isLoading}
                        className={`rounded-md w-[50%] px-6 py-2 text-white font-bold bg-primary hover:bg-blue-900 ${!selectedUserId || selectedUserId === "" || isLoading
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                            }`}
                    >
                        {isSubmitting ? 'Processing...' : 'Transfer Ownership'}
                    </button>
                </div>
            </div>

            {showConfirmDialog && (
                <ConfirmDialog
                    isOpen={showConfirmDialog}
                    title="Confirm Ownership Transfer"
                    message="Are you sure you want to transfer your ownership to chosen Admin?"
                    infoMessage='*This operation cannot be undone'
                    onCancel={() => setShowConfirmDialog(false)}
                    onConfirm={handleConfirmChange}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
}