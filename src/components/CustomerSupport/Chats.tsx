"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import ChatsTable from "./ChatsTable";

const headings = ["ChatID", "UserID", "AgentID", "IssueType", "Status", "LastUpdated", "Chat"]

const chatsData = [
    {
      ChatID: "CH-1001",
      UserID: "CP-9000",
      AgentID: "CP-9004",
      IssueType: "Crypto Release Issue",
      Status: "Resolved",
      LastUpdated: "2025-03-10 14:30",
      Chat: "chat.cashpay/89342998d..."
    },
    {
      ChatID: "CH-1001",
      UserID: "CP-9000",
      AgentID: "CP-9004",
      IssueType: "Crypto Release Issue",
      Status: "Resolved",
      LastUpdated: "2025-03-10 14:30",
      Chat: "chat.cashpay/89342998d..."
    },
    {
      ChatID: "CH-1001",
      UserID: "CP-9000",
      AgentID: "CP-9004",
      IssueType: "Crypto Release Issue",
      Status: "Resolved",
      LastUpdated: "2025-03-10 14:30",
      Chat: "chat.cashpay/89342998d..."
    },
    {
      ChatID: "CH-1001",
      UserID: "CP-9000",
      AgentID: "CP-9004",
      IssueType: "Crypto Release Issue",
      Status: "Resolved",
      LastUpdated: "2025-03-10 14:30",
      Chat: "chat.cashpay/89342998d..."
    },
    {
      ChatID: "CH-1001",
      UserID: "CP-9000",
      AgentID: "CP-9004",
      IssueType: "Crypto Release Issue",
      Status: "Resolved",
      LastUpdated: "2025-03-10 14:30",
      Chat: "chat.cashpay/89342998d..."
    }
  ]
  

const navigationTabs = [
    { id: "all", title: "All" },
    { id: "ongoing", title: "Ongoing" },
    { id: "pending", title: "Pending" },
    { id: "resolved", title: "Resolved" },
];

export default function Chats() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(15); // Example total pages
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState(chatsData);
    const [filteredData, setFilteredData] = useState(data);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // filter based on active tab
    useEffect(() => {
        const filtered = data.filter((request) => {

            if (activeTab === "all") {
                return true; 
            } else if (activeTab === "pending") {
                return request.Status === "Pending";
            } else if (activeTab === "ongoing") {
                return request.Status === "Ongoing";
            } else if (activeTab === "resolved") {
                return request.Status === "Resolved";
            }
        });
        setFilteredData(filtered);
    }, [activeTab]);

    useEffect(() => {
        const filtered = data.filter((chat) => {
            return (
                chat.ChatID.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredData(filtered);
    }, [searchQuery]);

    return (
        <div className="px-2">

            {/* Navigation Tabs */}
            <div className="w-full flex items-center mb-4">
                <div className="flex w-fit">
                    {navigationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-black ${activeTab === tab.id
                                ? "border-b-2 border-primary font-semibold"
                                : "hover:text-gray-700 cursor-pointer"
                                }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Actions */}
            <div className={`flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4`}>
                <div className={`relative w-full md:w-auto md:col-span-3`}>
                    <div className="relative">
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:gray-700 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Image src="/icons/search.svg" alt="Arrow right" width={24} height={24} />
                        </div>
                    </div>
                </div>

                <div className={`flex items-center gap-4 w-full font-[satoshi] md:col-span-1`}>
                    <button className="w-full flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                        <span>Filter</span>
                        <Image src="/icons/calendar.svg" alt="Arrow right" width={24} height={24} />
                    </button>
                </div>

            </div>

            <ChatsTable headings={headings} data={filteredData} />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
