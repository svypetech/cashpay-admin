"use client";

import { useState } from "react";
import Pagination from "../pagination/pagination";
import ActiveUsersTable from "../tables/ActiveUsersTable";
import useFetchUsers from "@/src/hooks/users/getUsers";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";

const headings = [
  "User ID",
  "Name",
  "Last Login",
  "Total Logins",
  "Session Duration",
];

export default function ActiveUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const { users, totalPages, isError, isLoading } = useFetchUsers(
    currentPage,
    10,
    "userStatus"
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : (
        <ActiveUsersTable headings={headings} data={users} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}