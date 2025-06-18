"use client";

import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import TransactionFrequencyTable from "../tables/TransactionFrequencyTable";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Image from "next/image";
import Search from "../ui/Search";
import Error from "../ui/Error";
import { useDateRangeFilter } from "@/src/hooks/filter/useSetDate";
import useFetchTransactions from "@/src/hooks/Transactions/transactionsManagement";
import { useDownloadData } from "@/src/hooks/downloadData/useDownloadData";
import DateRangePicker from "../ui/DateRangePicker";

const headings = [
  "Transaction ID",
  "User ID",
  "Currency",
  "Amount",
  "Status",
  "Timestamp",
];

export default function TransactionFrequencyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { startDate, endDate, handleDateChange } = useDateRangeFilter();

  const { transactions, loading, error, totalPages } = useFetchTransactions({
    page: currentPage,
    limit: 10,
    searchQuery: searchQuery,
    startDate,
    endDate,
  });

  // Use the CSV download hook
  const { downloadData, isDownloading } = useDownloadData({
    filename: "transaction_frequency",
    dateInFilename: true,
  });

  // Define CSV field mapping
  const csvFields = [
    { key: "id", label: "Transaction ID" },
    { key: "userId", label: "User ID" },
    { key: "tokenName", label: "Currency" },
    { 
      key: "amount", 
      label: "Amount",
      transform: (value: any) => {
        if (typeof value === 'number') {
          return value.toFixed(2);
        }
        return value || "0.00";
      }
    },
    {
      key: "status",
      label: "Status",
      transform: (value: string) => value?.toLowerCase() || "N/A",
    },
    {
      key: "date",
      label: "Timestamp",
      transform: (value: string) => {
        try {
          return value ? new Date(value).toLocaleString() : "N/A";
        } catch {
          return "Invalid Date";
        }
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Handle download button click
  const handleDownload = async () => {
    const dataToDownload = transactions.length > 0 ? transactions : transactions;
    const result = await downloadData(dataToDownload, csvFields);

    if (!result.success) {
      alert(result.error || "Failed to download data. Please try again.");
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search query or date range changes
  }, [searchQuery, startDate, endDate]);

  return (
    <div>
      <h1 className="text-3xl font-[satoshi] font-bold my-10">
        Transaction Frequency
      </h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center mb-4 gap-4 w-full mt-6">
        {/* Search Bar - 50% */}
        <div className="md:w-[50%] w-full">
          <Search className="w-full" onSearch={handleSearch} />
        </div>

        {/* Filter and Download - 50% */}
        <div className="flex flex-col sm:flex-row gap-4 md:w-[50%] w-full">
          <div className="sm:w-[50%] w-full">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              placeholder="Filter"
            />
          </div>

          {/* Download - 50% */}
          <div className="sm:w-[50%] w-full">
            <button
              onClick={handleDownload}
              disabled={
                isDownloading || loading || !transactions || transactions.length === 0
              }
              className="w-full flex justify-center items-center gap-2 px-4 py-2 font-bold border-[1px] border-primary rounded-[8px] text-primary bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isDownloading ? "Downloading..." : "Download"}</span>
              {isDownloading ? (
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Image
                  src="/icons/download.svg"
                  alt="Download"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : error ? (
        <Error text="Error fetching transactions" />
      ) : transactions.length === 0 ? (
        <Error text="No transactions found" />
      ) : (
        <TransactionFrequencyTable headings={headings} data={transactions} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}