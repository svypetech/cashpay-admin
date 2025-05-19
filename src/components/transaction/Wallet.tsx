"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import WalletTable from "@/src/components/tables/WalletTable";
import useWallet from "@/src/hooks/Transactions/useWallet";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import { Wallet } from "@/src/Types/Wallet";

const headings = ["User ID", "Name", "Card User", "Crypto Holdings", "Total Balance (USDT)", "Actions"];

export default function WalletComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Wallet []>([]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  let { wallets, loading, isError, totalPages } = useWallet({
    currentPage,
    limit: 10,
    sortBy: "id",
    searchQuery,
  });
  useEffect(() => {
    setFilteredData(wallets);
  }, [searchQuery, wallets]);

  return (
    <div>
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