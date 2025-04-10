"use client";

import { useState } from "react";
import Pagination from "../pagination/pagination";
import ActiveUsersTable from "../tables/ActiveUsersTable";

const headings = ["User ID", "Name", "Login Frequency", "Time Spent (avg/ day)", "Last Activity"];

const users = [
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
  { id: "CP-001", name: "John Doe", loginFrequency: "5 times a day", timeSpent: "30 mins", lastActivity: "P2P Trading" },
];

export default function UserEngagement() {
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