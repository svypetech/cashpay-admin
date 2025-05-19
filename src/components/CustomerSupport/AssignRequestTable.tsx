'use client';

import { shortenAddress } from '@/src/lib/functions';
import { Agent } from '@/src/Types/Agent';
import React from 'react';

interface Props {
    headings: string[];
    agents: Agent[];
    handleAssignRequest: (userId: string) => void;
    selectedAgentId: string;
}

const AssignRequestTable: React.FC<Props> = ({ headings, agents, handleAssignRequest, selectedAgentId }) => {
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
                        {Array.isArray(agents) &&
                            agents.map((agent, index) => (
                                <tr
                                    key={index} 
                                    className="border-b text-[12px] sm:text-[16px]"
                                >
                                    <td
                                        className={`whitespace-nowrap p-2 sm:p-4 font-satoshi w-[100px]`}
                                    >
                                        {shortenAddress(agent._id)}
                                    </td>
                                    <td
                                        className={`whitespace-nowrap p-2 sm:p-4 font-satoshi font-bold text-primary w-[200px]`}
                                    >
                                        {agent.title}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-[100px]"
                                    >
                                        {agent.email}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-[40px] text-center"
                                    >
                                        {agent.count}
                                    </td>
                                    <td
                                        className="p-2 sm:p-4 font-satoshi w-[100px]"
                                    >
                                        <button
                                            onClick={() => handleAssignRequest(agent._id)}
                                            className={`cursor-pointer border rounded-xl px-4 py-2 text-sm font-bold ${
                                                selectedAgentId === agent._id
                                                  ? "bg-primary text-white border-primary"
                                                  : "border-primary text-primary hover:bg-blue-50"
                                            }`}
                                        >
                                            {selectedAgentId === agent._id ? 'Selected' : 'Assign'}
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