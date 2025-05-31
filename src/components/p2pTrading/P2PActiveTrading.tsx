"use client";

import { useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Sort from "../ui/Sort";
import Search from "../ui/Search";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Error from "../ui/Error";
import P2PTableActive from "./P2PTableActive";
import useFetchActiveTrades from "@/src/hooks/p2p/useFetchActiveTrades";


const activeHeadings = ["Trade ID", "Seller ID", "Buyer ID", "Amount", "Currency", "Payment", "Status", "Actions"];

const sortOptions = [
  { label: "None", value: "" },
  { label: "Merchant ID", value: "merchantId" },
  { label: "Requested By", value: "requestedBy" },
  { label: "ID", value: "id" },
];

export default function P2PActiveTrading() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { activeTrades, setTrades, totalPages, isLoading, isError } = useFetchActiveTrades(
    {
      currentPage,
      limit: 10,
      searchQuery,
      sortBy
    }
  );

  return (
    <div>
      {/* Search and Actions */}
      <div className="flex flex-col gap-4 sm:gap-[28px] sm:flex-row">
        <Search className="sm:w-[80%] w-full" onSearch={setSearchQuery} />
        <Sort
          className="sm:w-[20%] w-full"
          title="Sort"
          options={sortOptions}
          onSort={setSortBy}
        />
      </div>

      {isLoading ? (
        <SkeletonTableLoader headings={activeHeadings} rowCount={10} />
      ) : isError ? (
        <Error text="Something went wrong" />
      ) : activeTrades.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <P2PTableActive headings={activeHeadings} data={activeTrades} setData={setTrades} />
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