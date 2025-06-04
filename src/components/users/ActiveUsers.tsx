"use client";

import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import ActiveUsersTable from "../tables/ActiveUsersTable";

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
  "Last Login",
  "Total Logins",
  "Session Duration",
];

export default function ActiveUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const { users, totalPages, isError, isLoading } = useFetchUsers(currentPage, 10);

  // Use the CSV download hook
  const { downloadData, isDownloading } = useDownloadData({
    filename: "active_users",
    dateInFilename: true,
  });

  // Define CSV field mapping for Active Users
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
      key: "lastLoginDate",
      label: "Last Login",
      transform: (value: string) => {
        try {
          return value ? new Date(value).toLocaleString() : "N/A";
        } catch {
          return "N/A";
        }
      },
    },
    { key: "totalLogin", label: "Total Logins" },
    {
      key: "sessionDuration",
      label: "Session Duration",
      transform: (value: number) => {
        if (!value) return "N/A";
        // Convert minutes to hours and minutes format
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
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
        <Error text="Something went wrong" />
      ) : filteredUsers.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <ActiveUsersTable headings={headings} data={filteredUsers} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}