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
  
  // Pass the debounced search query to the hook
  const { transactions, totalPages, loading, error } = useFetchTransactions({ 
    page: currentPage, 
    limit: 10, 
    searchQuery: debouncedSearchQuery 
  });
  
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Apply filters whenever transactions or active tab changes
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setFilteredTransactions([]);
      return;
    }

    let filtered = [...transactions];
    
    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((transaction) => 
        transaction.status === activeTab
      );
    }
    
    // No need to filter by search here since we're using the API for search
    
    setFilteredTransactions(filtered);
  }, [transactions, activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {debouncedSearchQuery !== searchQuery ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
              ) : (
                <Image src="/icons/search.svg" alt="Search" width={24} height={24} />
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
      ) : filteredTransactions.length === 0 ? (
        <div className="flex justify-center items-center py-10">No transactions found</div>
      ) : (
        <div>
          <TransactionTable headings={headings} data={filteredTransactions} />
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