'use client';
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import AssignRequestTable from './AssignRequestTable';
import useFetchAgents from '@/src/hooks/support/getAgents';
import SkeletonTableLoader from '../skeletons/SkeletonTableLoader';
import { Loader2 } from 'lucide-react';
import Pagination from '../pagination/pagination';

const TableHeadings = ["Agent ID", "Name", "Email", "Available Tickets", "Actions"];

interface AssignRequestDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    handleAssign: (agentId: string) => void;
    isLoading?: boolean;
    requestId?: string; // Add support request ID
}

export default function AssignRequestDialog({
    isOpen,
    handleAssign,
    onCancel,
    isLoading = false,
    requestId = "",
}: AssignRequestDialogProps) {
    const [selectedAgentId, setSelectedAgentId] = useState<string>("");
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { agents, isLoading: agentsLoading, error: agentsError, totalPages } = useFetchAgents(currentPage, 10);   
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedAgentId || selectedAgentId === "") {
            setError('Please select an agent');
            return;
        }

        if (!requestId) {
            setError('Invalid request ID');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/support-request/updateRequest`,
                {
                    id: requestId,
                    assignedTo: selectedAgentId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                handleAssign(selectedAgentId);
                onCancel(); // Close the dialog
            } else {
                setError(response.data.message || 'Failed to assign request');
            }
        } catch (err) {
            console.error('Error assigning request:', err);
            setError('An error occurred while assigning the request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-100 p-4">
            <div
                className="bg-white rounded-lg md:max-w-[900px] w-full max-h-[90vh] flex flex-col p-6 overflow-y-auto"
                role="dialog"
                aria-labelledby="assign-request-title"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3
                        id="assign-request-title"
                        className="text-2xl font-bold"
                    >
                        Assign Request
                    </h3>
                    <button
                        onClick={onCancel}
                        className="cursor-pointer"
                        aria-label="Close dialog"
                        disabled={isSubmitting}
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
                    {agentsLoading ? (
                        <SkeletonTableLoader rowCount={5} headings={TableHeadings} />
                    ) : agentsError ? (
                        <div className="text-red-500 text-center">
                            <p>{agentsError}</p>
                        </div>
                    ) : (
                        <>
                            <AssignRequestTable
                                headings={TableHeadings}
                                agents={agents}
                                selectedAgentId={selectedAgentId}
                                handleAssignRequest={(agentId: string) => {
                                    setSelectedAgentId(agentId);
                                }}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex justify-center mt-auto w-full gap-4 px-5">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAgentId || selectedAgentId === "" || isSubmitting}
                        className={`rounded-md w-[50%] px-6 py-2 text-white font-bold bg-primary hover:bg-blue-900 ${!selectedAgentId || selectedAgentId === "" || isSubmitting
                                ? 'cursor-not-allowed opacity-70'
                                : 'cursor-pointer'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            'Done'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}