"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import TransactionTable from "../tables/TransactionsTable";
import Error from "../ui/Error";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Sort from "../ui/Sort";
import Search from "../ui/Search";
import Tabs from "../ui/Tabs";
import useFetchTransactions from "@/src/hooks/Transactions/transactionsManagement";
const headings = ["ID", "From", "To", "Amount", "Status", "Block#", "Date"];
const navigationTabs = ["All", "Completed", "Pending", "Failed"];

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { transactions, loading, error, totalPages } = useFetchTransactions({
    page: currentPage,
    limit: 10,
    searchQuery,
    status: activeTab === "All" ? "" : activeTab,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <div className="flex w-fit gap-2">
          <Tabs
            activeTab={activeTab}
            tabs={navigationTabs}
            setActiveTab={setActiveTab}
            size="small"
          />
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-4 sm:gap-[28px] sm:flex-row">
        <Search className="sm:w-[80%] w-full" onSearch={setSearchQuery} />
        <Sort
          className="sm:w-[20%] w-full"
          title="Sort"
          options={[]}
          onSort={() => {}}
        />
      </div>
      {loading ? (
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : error ? (
          <Error text="Something went wrong" />
      ) : transactions.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <div className="mt-4">
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
