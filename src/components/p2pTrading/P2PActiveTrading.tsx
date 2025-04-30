"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/src/components/pagination/pagination";
import P2PTableActive from "./P2PTableActive";
import { activeData, activeHeadings } from "./data";

export default function P2PActiveTrading() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(15);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(activeData);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Filter data based on search query
    useEffect(() => {
        const filtered = activeData.filter((trade) => {
            return trade.tradeId.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredData(filtered);
    }, [searchQuery]);

    return (
        <div>
            {/* Search and Actions */}
            <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4">
                <div className="relative w-full md:w-auto md:col-span-3">
                    <div className="relative">
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:gray-700 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Image src="/icons/search.svg" alt="Search" width={24} height={24} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full font-[satoshi] md:col-span-1">
                    <button className="w-full flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                        <span>Sort by</span>
                        <Image src="/icons/dropdownIcon.svg" alt="Dropdown" width={24} height={24} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <P2PTableActive headings={activeHeadings} data={filteredData} />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}