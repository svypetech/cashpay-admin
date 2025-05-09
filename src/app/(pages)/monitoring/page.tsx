"use client";
import AlertsSection from "@/src/components/monitoring/alerts/AlertsSection";
import MainSection from "@/src/components/monitoring/apilogs/APILogsSection";
import SystemHealthSection from "@/src/components/monitoring/systemHealth/SystemHealthSection";
import Tabs from "@/src/components/monitoring/Tabs";
import { useState } from "react";

export default function Monitoring() {
  const [activeTab, setActiveTab] = useState("API Logs");
  const tabs = ["API Logs", "System Health", "Alerts"];
  
  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "API Logs":
        return <MainSection />;
      case "System Health":
        return <SystemHealthSection />;
      case "Alerts":
        return <AlertsSection />;
      default:
        return <MainSection />;
    }
  };
  
  return (
    <div className="flex flex-col gap-4 relative px-6 sm:px-10 py-6">
      <div className="flex items-center justify-center">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} size="normal" />
      </div>
      
      {renderContent()}
    </div>
  );
}