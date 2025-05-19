"use client"

import { useState, useMemo } from "react";
import Pagination from "../pagination/pagination";
import Tabs from "../ui/Tabs";
import Search from "../ui/Search";
import Sort from "../ui/Sort";
import MerchantsTable from "./MerchantTable";
import useFetchMerchants from "@/src/hooks/merchants/getMerchants";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";

// Table headings
const headings = [
  "User ID",
  "Name",
  "E-mail",
  "Trades Completed",
  "Success Rate",
  "Status",
  "Actions",
];

// Sort options
const sortOptions = [
  { label: "Status", value: "userStatus" },
  { label: "Date", value: "date" },
  { label: "Title", value: "title" },
];

export default function MerchantsComponent() {
  // All states in one place
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { merchants, isLoading, error, totalPages } = useFetchMerchants(currentPage, 10, sortBy);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort
  const handleSort = (value: string) => {
    setSortBy(value);
  };

  // User action handlers
  const handleViewUser = (userId: string) => {
    console.log(`View user ${userId}`);
  };

  const handleSuspendUser = (userId: string) => {
    console.log(`Suspend user ${userId}`);
  };

  const handleBanUser = (userId: string) => {
    console.log(`Ban user ${userId}`);
  };

  // Filter and sort merchants based on activeTab, searchTerm, and sortBy
  const filteredMerchants = useMemo(() => {
    // First filter by tab
    let filtered = [...merchants];

    if (activeTab === "Verified") {
      filtered = merchants.filter(merchant => merchant.verified);
    } else if (activeTab === "Pending Verifications") {
      filtered = merchants.filter(merchant => !merchant.verified);
    }

    // Then apply search filter if searchTerm exists
    if (searchTerm.trim()) {
      
    }

    // Apply sorting
    if (sortBy) {

    }

return filtered;
  }, [merchants, activeTab, searchTerm, sortBy]);

return (
  <>
    {/* Navigation Tabs */}
    <Tabs
      tabs={["All", "Verified", "Pending Verifications"]}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      size="normal"
    />

    {/* Search and Actions */}
    <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4 mt-4">
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

    {/* Content area with separated table component */}
    {isLoading ? (
        <SkeletonTableLoader  headings={headings} rowCount={10}/>
      ) : error ? (
        <div className="text-red-500 py-10 text-center">Error loading users</div>
      ) : 
    <div className="mt-4">
      <MerchantsTable
        headings={headings}
        merchants={filteredMerchants}
        onViewUser={handleViewUser}
      />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>}
  </>
);
}
