"use client";

import { useState } from "react";
import Pagination from "../pagination/pagination";
import UserTable from "../tables/UserTable";

const headings = [
  "User ID",
  "Name",
  "E-mail",
  "Joined date",
  "Status",
  "Actions",
];

const data = [
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Pending",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Pending",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Pending",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
];

export default function AllUsers({ activeTab }: { activeTab: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15); // Example total pages

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter data based on activeTab
  const filteredData = data.filter((user) => {
    if (activeTab === "all") return true;
    return user.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div>
      <UserTable headings={headings} data={filteredData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
