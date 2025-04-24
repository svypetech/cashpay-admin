"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import P2PTableActive from "./P2PTableActive";
import P2PTableDisputed from "./P2PTableDisputed";

const activeHeadings = ["Trade ID", "Seller ID", "Buyer ID", "Amount", "Currency", "Payment", "Status", "Actions"];

const activeData = [
    {
        hash: "192802",
        tradeId: "IDWTD-9203",
        sellerId: "IDHCP-9000",
        buyerId: "IDHCP-5603",
        amount: 1.35,
        currency: "BTC",
        payment: "Bank Transfer",
        status: "Pending"
    },
    {
        hash: "192802",
        tradeId: "IDWTD-9204",
        sellerId: "IDHCP-9000",
        buyerId: "IDHCP-5603",
        amount: 1.35,
        currency: "BTC",
        payment: "Bank Transfer",
        status: "Pending"
    },
    {
        hash: "192802",
        tradeId: "IDWTD-9205",
        sellerId: "IDHCP-9000",
        buyerId: "IDHCP-5603",
        amount: 1.35,
        currency: "BTC",
        payment: "Bank Transfer",
        status: "Pending"
    },
    {
        hash: "192802",
        tradeId: "IDWTD-9206",
        sellerId: "IDHCP-9000",
        buyerId: "IDHCP-5603",
        amount: 1.35,
        currency: "BTC",
        payment: "Bank Transfer",
        status: "Pending"
    },
    {
        hash: "192802",
        tradeId: "IDWTD-9207",
        sellerId: "IDHCP-9000",
        buyerId: "IDHCP-5603",
        amount: 1.35,
        currency: "BTC",
        payment: "Bank Transfer",
        status: "Pending"
    },

];

const disputedHeadings = ["Dispute ID", "Trade ID", "Reason", "Status", "Chat History", "Actions"];
const disputedData = [
    {
        disputeId: "ID#DP-9000",
        tradeId: "ID#TD-9203",
        reason: "Incorrect Amount",
        status: "Open",
        chatHistory: "chat.cashpay/89342998d..." // Or full URL if needed
    },
    {
        disputeId: "ID#DP-9000",
        tradeId: "ID#TD-9203",
        reason: "Incorrect Amount",
        status: "Open",
        chatHistory: "chat.cashpay/89342998d..." // Or full URL if needed
    },
    {
        disputeId: "ID#DP-9000",
        tradeId: "ID#TD-9203",
        reason: "Incorrect Amount",
        status: "Open",
        chatHistory: "chat.cashpay/89342998d..." // Or full URL if needed
    },
    {
        disputeId: "ID#DP-9000",
        tradeId: "ID#TD-9203",
        reason: "Incorrect Amount",
        status: "Open",
        chatHistory: "chat.cashpay/89342998d..." // Or full URL if needed
    },
    {
        disputeId: "ID#DP-9000",
        tradeId: "ID#TD-9203",
        reason: "Incorrect Amount",
        status: "Open",
        chatHistory: "chat.cashpay/89342998d..." // Or full URL if needed
    },
];

const navigationTabs = [
    { id: "active", title: "Active" },
    { id: "disputed", title: "Disputed" },
    { id: "stuck", title: "Stuck" },
];

export default function P2PTrading() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(15); // Example total pages
    const [activeTab, setActiveTab] = useState("active");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<(typeof activeData[number] | typeof disputedData[number])[]>(activeData);
    const [headings, setHeadings] = useState(activeHeadings);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // filter based on active tab
    useEffect(() => {
        if (activeTab === "active") {
            setFilteredData(activeData);
            setHeadings(activeHeadings);
        } else if (activeTab === "disputed") {
            setFilteredData(disputedData);
            setHeadings(disputedHeadings);
        } else if (activeTab === "stuck") {
            // setFilteredData();
        }
    }, [activeTab]);

    useEffect(() => {
        const filtered = filteredData.filter((trade) => {
            return (
                trade.tradeId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredData(filtered);
    }, [searchQuery]);

    return (
        <div>

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
                        <span>Sort by</span>
                        <Image src="/icons/dropdownIcon.svg" alt="Arrow right" width={24} height={24} />
                    </button>
                </div>

            </div>
            {/* @ts-ignore */}
            {activeTab === "active" &&  <P2PTableActive headings={headings} data={filteredData} />}
            {/* @ts-ignore */}
            {activeTab === "disputed" &&  <P2PTableDisputed headings={headings} data={filteredData} />}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
