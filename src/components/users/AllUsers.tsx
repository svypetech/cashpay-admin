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
    "Actions"
  ];
  
  const data = [
    {
      id: "ID#CP-9203",
      name: "John Doe",
      email: "johndoe@gmail.com",
      joinedDate: "18-03-25",
      status: "Verified"
    },
    {
      id: "ID#CP-9203",
      name: "John Doe",
      email: "johndoe@gmail.com",
      joinedDate: "18-03-25",
      status: "Verified"
    },
    {
      id: "ID#CP-9203",
      name: "John Doe",
      email: "johndoe@gmail.com",
      joinedDate: "18-03-25",
      status: "Verified"
    },
    {
      id: "ID#CP-9203",
      name: "John Doe",
      email: "johndoe@gmail.com",
      joinedDate: "18-03-25",
      status: "Verified"
    },
    {
      id: "ID#CP-9203",
      name: "John Doe",
      email: "johndoe@gmail.com",
      joinedDate: "18-03-25",
      status: "Verified"
    }
  ];

export default function AllUsers() {
    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15); // Example total pages

  const handlePageChange = (page: number) => {
    // Handle page change logic here
    setCurrentPage(page);
  }

    return (
        <div>
            <UserTable headings={headings} data={data} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}