"use client";

import { useState } from "react";
import Pagination from "../pagination/pagination";
import ActiveUsersTable from "../tables/ActiveUsersTable";

const headings = ["User ID", "Name", "Last Login", "Total Logins", "Session Duration"];

const users = [
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
  { id: "CP-001", name: "John Doe", lastLogin: "2025-03-10 10:00", totalLogins: 45, sessionDuration: "15 MINS" },
]

export default function ActiveUsers() {
    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15); // Example total pages

  const handlePageChange = (page: number) => {
    // Handle page change logic here
    setCurrentPage(page);
  }

    return (
        <div>
            <ActiveUsersTable headings={headings} data={users} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}