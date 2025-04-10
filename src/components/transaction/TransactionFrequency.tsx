"use client";

import { useState } from "react";
import Pagination from "../pagination/pagination";
import UserTable from "../tables/UserTable";
import TransactionFrequencyTable from "../tables/TransactionFrequencyTable";

const headings = ["Transaction ID", "User ID", "Currency", "Amount", "Status", "Timestamp"];

const data = [
  {
    id: "TXN-1001",
    userId: "CP-001",
    currency: "BTC",
    amount: 1.35,
    status: "Pending",
    timestamp: "2025-03-10 10:00",
  },
  {
    id: "TXN-1001",
    userId: "CP-001",
    currency: "BTC",
    amount: 1.35,
    status: "Pending",
    timestamp: "2025-03-10 10:00",
  },
  {
    id: "TXN-1001",
    userId: "CP-001",
    currency: "BTC",
    amount: 1.35,
    status: "Pending",
    timestamp: "2025-03-10 10:00",
  },
  {
    id: "TXN-1001",
    userId: "CP-001",
    currency: "BTC",
    amount: 1.35,
    status: "Pending",
    timestamp: "2025-03-10 10:00",
  },
  {
    id: "TXN-1001",
    userId: "CP-001",
    currency: "BTC",
    amount: 1.35,
    status: "Pending",
    timestamp: "2025-03-10 10:00",
  },
  {
    id: "TXN-1001",
    userId: "CP-001",
    currency: "BTC",
    amount: 1.35,
    status: "Pending",
    timestamp: "2025-03-10 10:00",
  },
];


export default function TransactionFrequencyPage() {
    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15); // Example total pages

  const handlePageChange = (page: number) => {
    // Handle page change logic here
    setCurrentPage(page);
  }

    return (
        <div>
            <TransactionFrequencyTable headings={headings} data={data} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}