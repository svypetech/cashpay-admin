"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import Image from "next/image";
import TransactionTable from "../tables/TransactionsTable";
import useFetchTransactions from "@/src/hooks/Transactions/transactionsManagement";
import Transaction from "@/src/Types/TransactionManagement";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";

const headings = ["ID", "From", "To", "Amount", "Status", "Block#", "Date"];

const navigationTabs = [
  { id: "all", title: "All" },
  { id: "completed", title: "Completed" },
  { id: "pending", title: "Pending" },
  { id: "failed", title: "Failed" },
];

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  // Pass both tab and search query to the hook
  const { transactions, totalPages, loading, error } = useFetchTransactions({ 
    page: currentPage, 
    limit: 10, 
    searchQuery: debouncedSearchQuery,
  });
  
  // No need for filtered transactions state anymore
  // We'll just use what comes from the API directly
  
  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when search query or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Clear search input function
  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

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
              value={searchQuery}
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:gray-700 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {debouncedSearchQuery !== searchQuery ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
              ) : searchQuery ? (
                <button 
                  onClick={clearSearch} 
                  className="cursor-pointer"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              ) : (
                <Image src="/icons/search.svg" alt="Search" width={24} height={24} className="pointer-events-none" />
              )}
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
      ) : error ? (
        <div className="flex justify-center items-center py-10">{error}</div>
      ) : !transactions || transactions.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-10">
          <Image src="/icons/no-data.svg" alt="No data" width={120} height={120} className="mb-4 opacity-70" />
          <p className="text-gray-500">No transactions found</p>
          {(searchQuery || activeTab !== "all") && (
            <button 
              onClick={() => {
                clearSearch();
                setActiveTab("all");
              }}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div>
          <TransactionTable headings={headings} data={transactions} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}