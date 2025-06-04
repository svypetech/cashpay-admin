"use client";

import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import UserEngagementTable from "../tables/UserEngagementTable";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Search from "../ui/Search";
import Image from "next/image";

import Error from "../ui/Error";
import useFetchUsers from "@/src/hooks/users/getUsers";
import { User } from "@/src/Types/User";
import { useDownloadData } from "@/src/hooks/downloadData/useDownloadData";



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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const { users, isLoading, isError, totalPages } = useFetchUsers(currentPage, 10);

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
        return `${value.firstName || ""} ${value.lastName || ""}.trim()`;
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
    const dataToDownload = filteredUsers.length > 0 ? filteredUsers : users;
    const result = await downloadData(dataToDownload, csvFields);

    if (!result.success) {
      alert(result.error || "Failed to download data. Please try again.");
    }
  };

  // Filter users based on search query
  useEffect(() => {
    if (!users) return;

    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.name?.firstName || ""} ${
        user.name?.lastName || ""
      }`.toLowerCase();
      return fullName.includes(query);
    });

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-6 gap-4">
        <div className="w-full md:w-1/2">
          <Search className="w-full" onSearch={handleSearch} />
        </div>

        <div className="flex items-center gap-4 w-full md:w-1/2 font-[satoshi]">
          <button className="w-full md:w-auto flex-1 cursor-pointer flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
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
              isDownloading || isLoading || !users || users.length === 0
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

      {/* Table Section */}
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : isError ? (
        <Error text="Error fetching users" />
      ) : filteredUsers.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <UserEngagementTable headings={headings} data={filteredUsers} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}