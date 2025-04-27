"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import CardOrdersTable from "@/src/components/tables/CardOrdersTable";

const headings = ["Order ID", "User ID", "Card Type", "Date", "Delivery Address", "Order Status", "Card Status", "Actions"];

const cardOrdersData = [
    {
        orderID: "CD-001",
        userID: "CP-001",
        cardType: "Physical",
        date: "18-03-25",
        deliveryAddress: "House#100, Anywhere S...",
        orderStatus: "Dispatched",
        cardStatus: "Inactive"
    },
    {
        orderID: "CD-001",
        userID: "CP-001",
        cardType: "Physical",
        date: "18-03-25",
        deliveryAddress: "House#100, Anywhere S...",
        orderStatus: "Dispatched",
        cardStatus: "Inactive"
    },
    {
        orderID: "CD-001",
        userID: "CP-001",
        cardType: "Physical",
        date: "18-03-25",
        deliveryAddress: "House#100, Anywhere S...",
        orderStatus: "Dispatched",
        cardStatus: "Inactive"
    },
    {
        orderID: "CD-001",
        userID: "CP-001",
        cardType: "Physical",
        date: "18-03-25",
        deliveryAddress: "House#100, Anywhere S...",
        orderStatus: "Dispatched",
        cardStatus: "Inactive"
    },
    {
        orderID: "CD-001",
        userID: "CP-001",
        cardType: "Physical",
        date: "18-03-25",
        deliveryAddress: "House#100, Anywhere S...",
        orderStatus: "Dispatched",
        cardStatus: "Inactive"
    },
    {
        orderID: "CD-001",
        userID: "CP-001",
        cardType: "Virtual",
        date: "18-03-25",
        deliveryAddress: "-",
        orderStatus: "Completed",
        cardStatus: "Active"
    },
    {
        orderID: "CD-001",
        userID: "CP-001",
        cardType: "Virtual",
        date: "18-03-25",
        deliveryAddress: "-",
        orderStatus: "Completed",
        cardStatus: "Active"
    }
]


const navigationTabs = [
    { id: "all", title: "All" },
    { id: "completed", title: "Completed" },
    { id: "pending", title: "Pending" },
];

export default function P2PTrading() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(15); // Example total pages
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState(cardOrdersData);
    const [filteredData, setFilteredData] = useState(data);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // filter based on active tab
    useEffect(() => {
        const filtered = data.filter((order) => {

            if (activeTab === "all") {
                return true; 
            } else if (activeTab === "completed") {
                return order.orderStatus === "Completed";
            } else if (activeTab === "pending") {
                return order.orderStatus === "Dispatched";
            }
        });
        setFilteredData(filtered);
    }, [activeTab]);

    useEffect(() => {
        const filtered = data.filter((order) => {
            return (
                order.orderID.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredData(filtered);
    }, [searchQuery]);

    return (
        <div className="px-2 md:px-10">

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

            <CardOrdersTable headings={headings} data={filteredData} />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
