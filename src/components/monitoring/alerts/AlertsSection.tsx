"use client";

import { useState } from "react";
import Tabs from "@/src/components/ui/Tabs";
import RulesTab from "./tabs/RulesTab";
import HistoryTab from "./tabs/HistoryTab";

export default function AlertsSection() {
  const [activeTab, setActiveTab] = useState("Rules");
  const tabs = ["Rules", "History"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          size="small"
        />
      </div>
      
      {activeTab === "Rules" ? <RulesTab /> : <HistoryTab />}
    </div>
  );
}
