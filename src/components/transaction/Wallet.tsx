"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import WalletTable from "@/src/components/tables/WalletTable";
import useWallet from "@/src/hooks/Transactions/useWallet";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import { Wallet } from "@/src/Types/Wallet";
import Sort from "../ui/Sort";
import Search from "../ui/Search";

const headings = ["User ID", "Name", "Card User", "Crypto Holdings", "Total Balance (USDT)", "Actions"];
const sortOptions = [
  { label: "ID", value: "id" },
  { label: "Name", value: "name" },
];

export default function WalletComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredData, setFilteredData] = useState<Wallet[]>([]);

  const { wallets, loading, isError, totalPages } = useWallet({
    currentPage,
    limit: 10,
    sortBy: sortBy,
    searchQuery,
  });

  useEffect(() => {
    setFilteredData(wallets);
  }, [searchQuery, wallets]);

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div>
      {/* Search and Actions */}
      <div className={`flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4`}>
        <Search
          className="w-full md:col-span-3"
          onSearch={handleSearch}
        />

        <Sort
          className="w-full"
          title="Sort by"
          options={sortOptions}
          onSort={handleSort}
        />


      </div>
      {loading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : isError ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Error loading wallets</p>
        </div>
      ) : (
        <>
          <WalletTable headings={headings} data={filteredData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

    </div>
  );
}