"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import ChatsTable from "./ChatsTable";
import useFetchChats from "@/src/hooks/support/getChats";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Error from "../ui/Error";
import Search from "../ui/Search";
import { useDateRangeFilter } from "@/src/hooks/filter/useSetDate";
import { useDownloadData } from "@/src/hooks/downloadData/useDownloadData";
import DateRangePicker from "../ui/DateRangePicker";

const headings = [
  "ChatID",
  "UserID",
  "AgentID",
  "IssueType",
  "Status",
  "LastUpdated",
  "Chat",
];

const navigationTabs = [
  { id: "all", title: "All" },
  { id: "pending", title: "Pending" },
  { id: "resolved", title: "Resolved" },
];

export default function Chats() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { startDate, endDate, handleDateChange } = useDateRangeFilter();
  
  const {
    requests: chatsData,
    isLoading,
    error,
    totalPages,
  } = useFetchChats({ page:currentPage, limit:10, tab:activeTab, search:searchQuery, startDate, endDate});
  
  const [data, setData] = useState(chatsData);
  const [filteredData, setFilteredData] = useState(data);

  // Use the CSV download hook
  const { downloadData, isDownloading } = useDownloadData({
    filename: "chats_data",
    dateInFilename: true,
  });

  // Define CSV field mapping for Chats - Updated to remove lastUpdated and description, add chat link
  const csvFields = [
    { key: "_id", label: "Chat ID" },
    { key: "userId", label: "User ID" },
    { 
      key: "agentId", 
      label: "Agent ID",
      transform: (value: any) => value || "Unassigned"
    },
    { key: "issueType", label: "Issue Type" },
    { key: "status", label: "Status" },
    {
      key: "_id",
      label: "Chat",
      transform: (value: string) => {
        // Generate chat link using the chat ID
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}/chat/${value}`;
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
    const dataToDownload = filteredData.length > 0 ? filteredData : chatsData;
    const result = await downloadData(dataToDownload, csvFields);

    if (!result.success) {
      alert(result.error || "Failed to download data. Please try again.");
    }
  };

  useEffect(() => {
    setData(chatsData);
    setFilteredData(chatsData);
  }, [chatsData]);

  // Filter based on active tab
  useEffect(() => {
    const filtered = data.filter((request) => {
      if (activeTab === "all") {
        return true;
      } else if (activeTab === "pending") {
        return request.status !== "Resolved";
      } else if (activeTab === "resolved") {
        return request.status === "Resolved";
      }
      return true;
    });
    setFilteredData(filtered);
  }, [activeTab, data]);

  // Reset to first page when search query, date range, or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, activeTab]);

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

      {/* Search and Filter Section - Updated to match UserEngagement */}
      <div className="flex flex-col md:flex-row items-center mb-4 gap-4 w-full mt-6">
        {/* Search Bar - 40% */}
        <div className="md:w-[50%] w-full">
          <Search className="w-full" onSearch={handleSearch} />
        </div>

        {/* Filter and Download - 60% */}
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
                isDownloading || isLoading || !filteredData || filteredData.length === 0
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
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : error ? (
        <Error text="Something went wrong" />
      ) : filteredData.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <div className="overflow-x-auto">
          <ChatsTable headings={headings} chats={filteredData} />
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