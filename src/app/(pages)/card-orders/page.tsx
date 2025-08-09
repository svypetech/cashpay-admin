"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import CardOrdersTable from "@/src/components/tables/CardOrdersTable";
import Tabs from "@/src/components/ui/Tabs";
import useFetchCardOrders from "@/src/hooks/cards/getCardOrders";
import SkeletonTableLoader from "@/src/components/skeletons/SkeletonTableLoader";
import Sort from "@/src/components/ui/Sort";
import Error from "@/src/components/ui/Error";
import Search from "@/src/components/ui/Search";

const headings = [
  "Order ID",
  "User ID", 
  "Card Type",
  "Date",
  "Delivery Address",
  "Order Status",
  "Card Status",
  "Actions",
];

const sortOptions = [
  { label: "Date", value: "date" },
  { label: "Freeze", value: "freeze" },
  { label: "Type", value: "type" },
  { label: "None", value: "" },
];

const tabs = ["All", "Physical Cards", "Virtual Cards"];

export default function CardOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Use the hook to fetch card orders
  const { cardOrders, totalPages, isLoading, error } = useFetchCardOrders({
    page: currentPage,
    limit: 10,
    sortBy,
    tab: activeTab,
    search: searchQuery,
  });

  // Reset to first page when search, sort, or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (option: string) => {
    setSortBy(option);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="px-6 sm:px-10 py-6">
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
      <div className="flex flex-col gap-4 sm:gap-[28px] sm:flex-row mb-4">
        <Search 
          className="sm:w-[80%] w-full" 
          onSearch={handleSearch}
        />
        <Sort
          className="sm:w-[20%] w-full"
          title="Sort by"
          options={sortOptions}
          onSort={handleSort}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : error ? (
        <Error text={error} />
      ) : cardOrders.length === 0 ? (
        <Error text="No card orders found" />
      ) : (
        <div className="overflow-x-auto">
          <CardOrdersTable headings={headings} data={cardOrders} />
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