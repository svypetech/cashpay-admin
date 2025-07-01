"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import CustomerSupportTable from "@/src/components/tables/CustomerSupportTable";
import useFetchSupportRequests from "@/src/hooks/support/getSupportRequests";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Sort from "../ui/Sort";
import Error from "../ui/Error";

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
  { label: "None" , value: "" }, 
];
const navigationTabs = [
  { id: "all", title: "All" },
  { id: "unassigned", title: "Unassigned" },
  { id: "assigned", title: "Assigned" },
];

export default function SupportRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { requests, totalPages, isLoading, error } = useFetchSupportRequests({
    page: currentPage,
    limit: 10,
    sortBy,
    tab: activeTab,
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
        <div className="flex w-fit">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-black ${
                activeTab === tab.id
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
      <div
        className={`flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4`}
      >
        <div className={`relative w-full md:w-auto md:col-span-3`}>
          <div className="relative">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:gray-700 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Image
                src="/icons/search.svg"
                alt="Arrow right"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>

        <Sort
          className="w-full font-[satoshi] md:col-span-1"
          title="Sort by"
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
