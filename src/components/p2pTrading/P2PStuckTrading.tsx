"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/src/components/pagination/pagination";
import Error from "../ui/Error";
import Search from "../ui/Search";
import Sort from "../ui/Sort";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import useFetchInactiveTrades from "@/src/hooks/p2p/useFetchInactiveTrades";
import P2PTableStuck from "./P2PTableStuck";

const stuckHeadings = [
  "Trade ID",
  "Seller ID",
  "Buyer ID",
  "Amount",
  "Currency",
  "Reason",
  "Status",
  "Actions",
];
const sortOptions = [
  { label: "None", value: "" },
  { label: "Merchant ID", value: "merchantId" },
  { label: "Requested By", value: "requestedBy" },
  { label: "ID", value: "id" },
];

export default function P2PStuckTrading() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const {
    inactiveTrades: stuckTrades,
    totalPages,
    isLoading,
    isError,
    setTrades,
  } = useFetchInactiveTrades({
    currentPage,
    limit: 10,
    searchQuery,
    sortBy,
    status: "stuck",
  });

  useEffect(() => {
    // Reset to first page when search or sort changes
    setCurrentPage(1);
  }, [searchQuery, sortBy,]);

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
        <SkeletonTableLoader
          headings={stuckHeadings}
          rowCount={10}
        />
      ) : isError ? (
        <Error text="Something went wrong" />
      ) : stuckTrades.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <P2PTableStuck
          headings={stuckHeadings}
          data={stuckTrades}
          setData={setTrades}
        />
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