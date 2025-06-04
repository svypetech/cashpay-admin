"use client";

import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import TransactionFrequencyTable from "../tables/TransactionFrequencyTable";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Image from "next/image";
import Search from "../ui/Search";
import Error from "../ui/Error";
import useFetchTransactions from "@/src/hooks/Transactions/transactionsManagement";
import { useDownloadData } from "@/src/hooks/downloadData/useDownloadData";

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

  const { transactions, loading, error, totalPages } = useFetchTransactions(
    {
      page: currentPage,
      limit: 10,
      searchQuery: searchQuery,
    }
  );

  // Use the CSV download hook
  const { downloadData, isDownloading } = useDownloadData({
    filename: "transactions",
    dateInFilename: true,
  });

  // Define CSV field mapping
  const csvFields = [
    { key: "id", label: "Transaction ID" },
    { key: "userId", label: "User ID" },
    { key: "tokenName", label: "Currency" },
    { key: "amount", label: "Amount" },
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
    const result = await downloadData(transactions, csvFields);

    if (!result.success) {
      alert(result.error || "Failed to download data. Please try again.");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div>
      <h1 className="text-3xl font-[satoshi] font-bold my-10">
        Transaction Frequency
      </h1>

      {/* Search and Actions */}
      <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto md:col-span-2">
          <Search className="w-full" onSearch={handleSearch} />
        </div>

        <div className="flex items-center gap-4 w-full md:col-span-2 font-[satoshi]">
          <button className="w-[50%] flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
            <span>Filter</span>
            <Image
              src="/icons/calendar.svg"
              alt="Calendar"
              width={24}
              height={24}
            />
          </button>

          <button
            onClick={handleDownload}
            disabled={
              isDownloading ||
              loading ||
              !transactions ||
              transactions.length === 0
            }
            className="w-[50%] flex justify-center items-center gap-2 px-4 py-2 font-bold border border-primary rounded-lg text-primary bg-white hover:bg-blue-50 ml-auto md:ml-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
            {isDownloading ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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

      {loading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : error ? (
        <Error text="Something went wrong" />
      ) : transactions.length === 0 ? (
        <Error text="No data found" />
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