"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Sort from "../ui/Sort";
import Error from "../ui/Error";
import Search from "../ui/Search";
import useFetchP2PListing from "@/src/hooks/Transactions/FetchP2PListing";
import ListingsTable from "../tables/ListingsTable";
import { Listing } from "@/src/Types/P2PListing";

const headings = [
  "Listing ID",
  "Seller ID",
  "Type",
  "Currency",
  "Status",
  "Actions",
];

const navigationTabs = [
  { id: "all", title: "All" },
  { id: "active", title: "Active" },
  { id: "inactive", title: "Inactive" },
];
const sortOptions = [
  { label: "None", value: "" },
  { label: "Currency", value: "currency" },
  { label: "Status", value: "status" },
];

export default function P2PListings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { listings, totalPages, isLoading, isError, setListings } =
    useFetchP2PListing({
      currentPage,
      limit: 10,
      searchQuery,
      addVisibility:
        activeTab === "all" ? "" : activeTab === "active" ? "true" : "false",
      sortBy: sortBy,
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, sortBy]);

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <div className="flex w-fit gap-5">
          {navigationTabs.map((tab, index) => (
            <button
              key={index}
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
      <div className="flex flex-col gap-4 sm:gap-[28px] sm:flex-row">
        <Search className="sm:w-[80%] w-full" onSearch={setSearchQuery} />
        <Sort
          className="sm:w-[20%] w-full"
          title="Sort"
          options={sortOptions}
          onSort={setSortBy}
        />
      </div>
      <div className="mt-4">
        {isLoading ? (
          <SkeletonTableLoader rowCount={10} headings={headings} />
        ) : isError ? (
          <Error text="Something went wrong" />
        ) : listings.length === 0 ? (
          <Error text="No data found" />
        ) : (
          <ListingsTable
            headings={headings}
            data={listings}
            setListings={setListings}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}