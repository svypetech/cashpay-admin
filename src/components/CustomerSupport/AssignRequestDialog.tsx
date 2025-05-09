'use client';
import Image from 'next/image';
import { useState } from 'react';
import AssignRequestTable from './AssignRequestTable';
import ConfirmDialog from '../cards/ConfirmDialog';

const data = [
    {
        agentID: "AG-001",
        name: "John Doe",
        email: "johndoe@gmail.com",
        availableTickets: 20,
    },
    {
        agentID: "AG-002",
        name: "Jane Smith",
        email: "janesmith@gmail.com",
        availableTickets: 15,
    },
    {
        agentID: "AG-003",
        name: "Robert Johnson",
        email: "rjohnson@gmail.com",
        availableTickets: 12,
    },
    {
        agentID: "AG-004",
        name: "Sarah Williams",
        email: "swilliams@gmail.com",
        availableTickets: 25,
    },
    {
        agentID: "AG-005",
        name: "Michael Brown",
        email: "mbrown@gmail.com",
        availableTickets: 8,
    },
];

const TableHeadings = ["Agent ID", "Name", "Email", "Available Tickets", "Actions"];

interface Request {
    agentID: string;
    name: string;
    email: string;
    availableTickets: number;
}

interface AssignRequestDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    handleAssign: (agentId: string) => void;
    isLoading?: boolean;
    requests?: Request[];
}

export default function AssignRequestDialog({
    isOpen,
    handleAssign,
    onCancel,
    isLoading = false,
    requests = data,
}: AssignRequestDialogProps) {
    const [selectedAgentId, setSelectedAgentId] = useState<string>("");
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!selectedAgentId || selectedAgentId === "") {
            setError('Please select an agent');
            return;
        }
        console.log(`Request assigned to agent ${selectedAgentId}`);
        
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-100 p-4">
            <div
                className="bg-white rounded-lg max-w-[900px] w-full max-h-[90vh] flex flex-col p-6"
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
                    <AssignRequestTable 
                        headings={TableHeadings} 
                        requests={requests} 
                        handleAssignRequest={handleAssign} 
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex justify-center mt-auto w-full gap-4 px-5">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAgentId || selectedAgentId === "" || isLoading}
                        className={`rounded-md w-[50%] px-6 py-2 text-white font-bold bg-primary hover:bg-blue-900 ${
                            !selectedAgentId || selectedAgentId === "" || isLoading
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                    >
                        {isSubmitting ? 'Processing...' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
}