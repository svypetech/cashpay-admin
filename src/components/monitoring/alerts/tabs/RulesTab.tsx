import { useState } from "react";
import Search from "@/src/components/ui/Search";
import Sort from "@/src/components/ui/Sort";
import Pagination from "@/src/components/pagination/pagination";
import RulesTable from "@/src/components/tables/RulesTable";
import AddRuleModal from "../rule/AddRuleModal";
import { rulesTableHeadings, rulesData } from "@/src/components/utils/AlertsData";

export default function RulesTab() {
 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(13);
  
  
  const [searchQuery, setSearchQuery] = useState("");
  
  
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [alertsData, setAlertsData] = useState(rulesData);
  const [filteredAlertsData, setFilteredAlertsData] = useState(rulesData);
  const [sortOptions, setSortOptions] = useState([
    { label: "Threshold", value: "threshold" },
    { label: "Duration", value: "duration" },
  ]);

  const handleSort = (sortBy: string) => {
    
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    // Filter data implementation would go here
    const filteredData = rulesData.filter((rule) =>
      rule.ruleName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAlertsData(filteredData);
  };

  const handleSubmitRule = (ruleData: any) => {
    if (selectedRule) {
      // Edit existing rule
      setAlertsData(
        alertsData.map((rule) =>
          rule.ruleId === selectedRule.ruleId
            ? {
                ...rule,
                ruleName: ruleData.ruleName,
                metric: ruleData.metric,
                threshold: ruleData.threshold,
                duration: ruleData.duration,
                notifications: ruleData.notifications,
                recipient: ruleData.recipient,
              }
            : rule
        )
      );
    } else {
      // Add new rule
      const newRuleId = `AR-${String(alertsData.length + 1).padStart(3, '0')}`;
      
      const newRule = {
        ruleId: newRuleId,
        ruleName: ruleData.ruleName,
        metric: ruleData.metric,
        threshold: ruleData.threshold,
        duration: ruleData.duration,
        notifications: ruleData.notifications,
        recipient: ruleData.recipient,
      };
      
      setAlertsData([...alertsData, newRule]);
    }
    
    // Close modal and reset selected rule
    setIsRuleModalOpen(false);
    setSelectedRule(null);
  };

  // Function to open the modal for editing
  const openEditModal = (rule: any) => {
    setSelectedRule(rule);
    setIsRuleModalOpen(true);
  };

  // Function to open the modal for adding
  const openAddModal = () => {
    setSelectedRule(null);
    setIsRuleModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-2">
        <div className="sm:w-[60%]">
          <Search onSearch={handleSearch} className="" />
        </div>

        <div className="flex gap-4 items-center sm:w-[40%] w-full">
          <Sort title="Sort by" options={sortOptions} onSort={handleSort} className="sm:w-[60%] w-[50%]" />
          <button 
            className="sm:w-[40%] w-[50%] bg-primary text-white font-medium md:my-1 py-2 px-4 rounded-lg hover:bg-primary/90"
            onClick={openAddModal}
          >
            Add Rule
          </button>
        </div>
      </div>

      <RulesTable 
        headings={rulesTableHeadings} 
        data={filteredAlertsData} 
        onEditRule={openEditModal}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AddRuleModal 
        isOpen={isRuleModalOpen}
        onClose={() => {
          setIsRuleModalOpen(false);
          setSelectedRule(null);
        }}
        onSubmit={handleSubmitRule}
        editRule={selectedRule}
      />
    </>
  );
}