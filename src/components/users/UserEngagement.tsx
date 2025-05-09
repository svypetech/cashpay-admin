"use client";

import { useState } from "react";
import Pagination from "../pagination/pagination";
import useFetchUsers from "@/src/hooks/users/useUser";
import UserEngagementTable from "../tables/UserEngagementTable";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";

const headings = [
  "User ID",
  "Name",
  "Login Frequency",
  "Time Spent (avg/ day)",
  "Last Activity",
];

export default function UserEngagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const { users, isLoading, isError, totalPages } = useFetchUsers(
    currentPage,
    10,
    "userStatus"
  );

  const handlePageChange = (page: number) => {
    // Handle page change logic here
    setCurrentPage(page);
  };

  return (
    <div>
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : isError ? (
        <div className="p-4 text-red-500 flex items-center justify-center h-[400px]">
          Error loading users
        </div>
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