"use client";

import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import UserEngagementTable from "../tables/UserEngagementTable";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Search from "../ui/Search";
import Image from "next/image";
import Error from "../ui/Error";
import { useDateRangeFilter } from "@/src/hooks/filter/useSetDate";
import useFetchUsers from "@/src/hooks/users/getUsers";
import { useDownloadData } from "@/src/hooks/downloadData/useDownloadData";
import DateRangePicker from "../ui/DateRangePicker";

const headings = [
  "User ID",
  "Name",
  "Login Frequency",
  "Time Spent (avg/ day)",
  "Last Activity",
];

export default function UserEngagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { startDate, endDate, handleDateChange } = useDateRangeFilter();
  const { users, isLoading, isError, totalPages } = useFetchUsers({
    currentPage: currentPage, 
    limit: 10, 
    startDate, 
    endDate, 
    search: searchQuery
  });

  // Use the CSV download hook
  const { downloadData, isDownloading } = useDownloadData({
    filename: "user_engagement",
    dateInFilename: true,
  });

  // Define CSV field mapping for User Engagement
  const csvFields = [
    { key: "id", label: "User ID" },
    {
      key: "name",
      label: "Name",
      transform: (value: any) => {
        if (!value) return "N/A";
        return `${value.firstName || ""} ${value.lastName || ""}`.trim();
      },
    },
    {
      key: "loginFrequency",
      label: "Login Frequency",
      transform: (value: any) => {
        if (!value) return "N/A";
        // If it's a number, assume it's logins per week
        if (typeof value === "number") {
          return `${value} times/week`;
        }
        return value;
      },
    },
    {
      key: "averageTime",
      label: "Time Spent (avg/ day)",
      transform: (value: any) => {
        if (!value) return "N/A";
        // If it's a number in minutes, convert to hours and minutes
        if (typeof value === "number") {
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        }
        return value;
      },
    },
    {
      key: "lastActivity",
      label: "Last Activity",
      transform: (value: string) => {
        try {
          return value ? new Date(value).toLocaleString() : "N/A";
        } catch {
          return "N/A";
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
    const dataToDownload = users.length > 0 ? users : users;
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
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center mb-4 gap-4 w-full mt-6">
        {/* Search Bar - 60% */}
        <div className="md:w-[50%] w-full">
          <Search className="w-full" onSearch={handleSearch} />
        </div>

        {/* Filter and Download - 40% */}
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
                isDownloading || isLoading || !users || users.length === 0
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
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : isError ? (
        <Error text="Error fetching users" />
      ) : users.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <UserEngagementTable headings={headings} data={users} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}