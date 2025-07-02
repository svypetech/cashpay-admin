"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import CustomerSupportTable from "@/src/components/tables/CustomerSupportTable";
import useFetchSupportRequests from "@/src/hooks/support/getSupportRequests";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Sort from "../ui/Sort";
import Error from "../ui/Error";
import Tabs from "../ui/Tabs";
import Search from "../ui/Search";

const headings = [
  "TicketID",
  "UserID",
  "AgentID",
  "RequestDate",
  "Subject",
  "Status",
  "Actions",
];
const sortOptions = [
  { label: "Date", value: "date" },
  { label: "Status", value: "status" },
  { label: "None", value: "" },
];
const tabs = ["All", "Unassigned", "Assigned"];

export default function SupportRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { requests, totalPages, isLoading, error } = useFetchSupportRequests({
    page: currentPage,
    limit: 10,
    sortBy,
    tab: activeTab.toLowerCase(),
    search: searchQuery,
  });

  useEffect(() => {
    // Reset to first page when search or sort changes
    setCurrentPage(1);
  }, [searchQuery, sortBy, activeTab]);

  const [filteredData, setFilteredData] = useState(requests);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setFilteredData(requests);
  }, [requests]);

  const handleSort = (option: string) => {
    setSortBy(option);
  };

  return (
    <div className="px-2">
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <Tabs
          tabs={tabs}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          size="normal"
        />
      </div>

      {/* Search and Actions */}
      <div
        className={`flex flex-col gap-4 sm:gap-[28px] sm:flex-row`}
      >
        <Search className="sm:w-[80%] w-full" onSearch={setSearchQuery} />
        <Sort
          className="sm:w-[20%] w-full"
          title="Sort"
          options={sortOptions}
          onSort={handleSort}
        />
      </div>
      {isLoading ? (
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : error ? (
        <Error text="Something went wrong" />
      ) : filteredData.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <div className="overflow-x-auto">
          <CustomerSupportTable headings={headings} data={filteredData} />
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
