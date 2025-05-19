"use client";

import { useState } from "react";
import Pagination from "../pagination/pagination";
import Image from "next/image";
import useFetchP2PListing from "@/src/hooks/Transactions/FetchP2PListing";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Sort from "../ui/Sort";
import ListingsTable from "../tables/ListingsTable";

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
  { id: "inactive", title: "InActive" },
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

  const { listings, totalPages, isLoading } = useFetchP2PListing({
    currentPage,
    limit: 10,
    searchQuery,
    addVisibility: activeTab === "all" ? "" : activeTab,
    sortBy: sortBy,
  });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // filter based on active tab

  //   if (loading) {
  //     return <div className="flex justify-center items-center h-screen">Loading...</div>;
  //   }

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <div className="flex w-fit">
          {navigationTabs.map((tab, index) => (
            <button
              key={index}
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
      <div
        className={`flex sm:flex-row flex-col  justify-between items-center mb-2 gap-4`}
      >
        <div className={`relative w-full sm:w-[70%] `}>
          <div className={`relative`}>
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

        <div
          className={"flex items-center gap-4 w-full font-[satoshi] sm:w-[30%]"}
        >
          <Sort
            options={sortOptions}
            onSort={setSortBy}
            title="Sort by"
            className="w-full"
          />
        </div>
      </div>
      {isLoading ? (
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : (
        <>
          <ListingsTable headings={headings} data={listings} />
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