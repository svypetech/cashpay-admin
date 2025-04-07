"use client";
import Topcards, { TopCardsProps } from "../components/dashboard/topcards";
import SearchField from "../components/dashboard/searchField";
import Blocks from "../components/dashboard/blocks";
import Transactions from "../components/dashboard/transactions";
import { useState } from "react";
import useFetchBlocks from "../hooks/blocks";
import { useFetchDashboardTransactions } from "../hooks/transactions";
import useFetchDashboardStats from "../hooks/dashboardStats";


export default function Page() {

  return (
    <div className=" flex flex-col items-between justify-between h-screen">
      HOME PAGE
    </div>
  );
}
