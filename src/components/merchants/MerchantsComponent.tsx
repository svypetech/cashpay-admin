"use client";

import { useState, useMemo } from "react";
import Pagination from "../pagination/pagination";
import Tabs from "../ui/Tabs";
import Search from "../ui/Search";
import Sort from "../ui/Sort";
import MerchantsTable from "./MerchantTable";
import useFetchMerchants from "@/src/hooks/merchants/getMerchants";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Error from "../ui/Error";

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
  { label: "None" , value: "" }, 
];

export default function MerchantsComponent() {
  // All states in one place
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Map tab to status parameter
  const getStatusFromTab = (tab: string) => {
    switch (tab) {
      case "Verified":
        return "Approved";
      case "Pending Verifications":
        return "Pending";
      default:
        return undefined; // "All" case - no status filter
    }
  };

  const { 
    merchants, 
    isLoading, 
    error, 
    totalPages, 
    setMerchants 
  } = useFetchMerchants(
    currentPage,
    10,
    sortBy,
    getStatusFromTab(activeTab),
    searchTerm
  );

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

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // User action handlers
  const handleViewUser = (userId: string) => {
    console.log(`View user ${userId}`);
  };

  return (
    <>
      {/* Navigation Tabs */}
      <Tabs
        tabs={["All", "Verified", "Pending Verifications"]}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        size="normal"
      />

      {/* Search and Actions */}
      <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4 mt-4">
        <Search className="w-full md:col-span-3" onSearch={handleSearch} />

        <Sort
          className="w-full"
          title="Sort by"
          options={sortOptions}
          onSort={handleSort}
        />
      </div>

      {/* Content area with separated table component */}
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : error ? (
        <Error text="Something went wrong." />
      ) : merchants.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <div className="mt-4">
          <MerchantsTable
            headings={headings}
            merchants={merchants}
            setMerchants={setMerchants}
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
        </div>
      )}
    </>
  );
}