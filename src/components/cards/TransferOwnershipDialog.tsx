'use client';
import Image from 'next/image';
import { useState } from 'react';
import TransferOwnershipTable from '../tables/TransferOwnershipTable';
import ConfirmDialog from './ConfirmDialog';
import useGetAdmins from '@/src/hooks/admins/getAdmins';
import Pagination from '../pagination/pagination';
import SkeletonTableLoader from '../skeletons/SkeletonTableLoader';


const headings = ['Agent ID', 'Name', 'Email', 'Type', 'Actions'];

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
    const [currentPage, setCurrentPage] = useState(1);
    const { admins, isLoading: isLoadingAdmins, error: fetchError, totalPages } = useGetAdmins(currentPage, 10);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!isOpen) return null;

    const handleSelectUser = (userId: string) => {
        setSelectedUserId(userId)
    };

    const handleSubmit = () => {
        if (!selectedUserId || selectedUserId === "") {
            setError('Please select a user');
            return;
        }
        setShowConfirmDialog(true);
        setError('');
    };

    const handleConfirmChange = async () => {
        setIsSubmitting(true);
        setShowConfirmDialog(false);

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
                {isLoadingAdmins ? (
                    <SkeletonTableLoader rowCount={5} headings={headings} />
                ) : fetchError ? (
                    <div className="text-red-500 text-center">
                        <p>{fetchError}</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-2">
                        <TransferOwnershipTable admins={admins} headings={headings} selectedUserId={selectedUserId} handleSelectUser={handleSelectUser} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />

                    </div>
                )}

                {error && <p className="text-red-500 text-center">{error}</p>}

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