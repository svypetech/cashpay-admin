"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Search from "../ui/Search";
import Sort from "../ui/Sort";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Error from "../ui/Error";
import P2PTableDisputed from "./P2PTableDisputed";
import useFetchInactiveTrades from "@/src/hooks/p2p/useFetchInactiveTrades";

const disputedHeadings = ["Trade ID", "Seller ID", "Buyer ID", "Reason", "Status", "Chat", "Actions"];

const sortOptions = [
  { label: "None", value: "" },
  { label: "Merchant ID", value: "merchantId" },
  { label: "Requested By", value: "requestedBy" },
  { label: "ID", value: "id" },
];

export default function P2PDisputedTrading() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");

    const { inactiveTrades: disputedTrades, totalPages, isLoading, isError,setTrades } = useFetchInactiveTrades({
        currentPage,
        limit: 10,
        searchQuery,
        sortBy,
        status: "disputed",
    });

    useEffect(() => {
        // Reset to first page when search or sort changes
        setCurrentPage(1);
      }, [searchQuery, sortBy]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        // Reset to page 1 when search changes
        setCurrentPage(1);
    };

    return (
        <div>
            {/* Search and Actions */}
            <div className="flex flex-col gap-4 sm:gap-[28px] sm:flex-row">
                <Search className="sm:w-[80%] w-full" onSearch={handleSearch} />
                <Sort
                    className="sm:w-[20%] w-full"
                    title="Sort"
                    options={sortOptions}
                    onSort={setSortBy}
                />
            </div>

            {/* Table with loading, error, and empty states */}
            {isLoading ? (
                <SkeletonTableLoader headings={disputedHeadings} rowCount={10} />
            ) : isError ? (
                <Error text="Something went wrong" />
            ) : disputedTrades.length === 0 ? (
                <Error text="No data found" />
            ) : (
                <P2PTableDisputed headings={disputedHeadings} data={disputedTrades} setData={setTrades} />
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}