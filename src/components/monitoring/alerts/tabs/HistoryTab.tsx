import { lazy, useState } from "react";
import Search from "@/src/components/ui/Search";
import Sort from "@/src/components/ui/Sort";
import Pagination from "@/src/components/pagination/pagination";
import { historyTableHeadings, historyData as HistoryData } from "@/src/components/utils/AlertsData";
import HistoryTable  from "@/src/components/tables/HistoryTable";

export default function HistoryTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(8);
  const [historyData, setHistoryData] = useState(HistoryData);
  const [filteredHistoryData, setFilteredHistoryData] = useState(HistoryData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOptions, setSortOptions] = useState([
    { label: "Triggered On", value: "triggeredOn" },
    { label: "Status", value: "status" },
  ]);

  const handleSort = (sortBy: string) => {

  }

  const handlePageChange = (page: number) => {

    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Filter data implementation would go here
    const filteredData = HistoryData.filter((alert) =>
      alert.ruleName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredHistoryData(filteredData);
    
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-2">
        <div className="sm:w-[75%]">
          <Search onSearch={handleSearch} className="" />
        </div>

        <Sort title="Sort by" onSort={handleSort} options={sortOptions} className="sm:w-[25%]" />
      </div>

      <HistoryTable headings={historyTableHeadings} data={filteredHistoryData} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}