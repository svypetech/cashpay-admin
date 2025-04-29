'use client';
import React from 'react';
interface Request {
    agentID: string;
    name: string;
    email: string;
    availableTickets: number;
}

interface Props {
    headings: string[];
    requests: Request[];
    handleAssignRequest: (userId: string) => void;
}

const AssignRequestTable: React.FC<Props> = ({ headings, requests, handleAssignRequest}) => {

    return (
        <div className={`flex-1 rounded-lg w-full sm:px-10 py-5`}>
            <div className="rounded-lg w-full">
                <table className="w-full text-left table-auto min-w-30">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] sm:text-[16px] p-2 sm:p-4">
                            {headings.map((heading, index) => (
                                <th
                                    key={index}
                                    className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6 whitespace-nowrap"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(requests) &&
                            requests.map((request, index) => (
                                <tr
                                    key={index} 
                                    className="border-b text-[12px] sm:text-[16px]"
                                >
                                    <td
                                        className={`whitespace-nowrap p-2 sm:p-4 font-satoshi w-[100px]`}
                                    >
                                        {request.agentID}
                                    </td>
                                    <td
                                        className={`whitespace-nowrap p-2 sm:p-4 font-satoshi font-bold text-primary w-[200px]`}
                                    >
                                        {request.name}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-[100px]"
                                    >
                                        {request.email}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-[40px] text-center"
                                    >
                                        {request.availableTickets}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-[100px]"
                                    >
                                        <button
                                            onClick={() => handleAssignRequest(request.agentID)}
                                            className=" cursor-pointer border border-primary text-primary rounded-xl px-4 py-2 text-sm font-bold hover:bg-blue-50"
                                        >
                                            Assign
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

export default AssignRequestTable;