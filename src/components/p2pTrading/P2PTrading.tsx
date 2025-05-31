"use client";

import { useState } from "react";
import P2PActiveTrading from "./P2PActiveTrading";
import P2PDisputedTrading from "./P2PDisputedTrading";
import P2PStuckTrading from "./P2PStuckTrading";
import Tabs from "../ui/Tabs";

const navigationTabs = ["Active", "Disputed", "Stuck"];

export default function P2PTrading() {
  const [activeTab, setActiveTab] = useState("Active");

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <div className="flex w-fit gap-5">
          <Tabs
            tabs={navigationTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            size="small"
          />
        </div>
      </div>

      {/* Render the active tab component */}
      {activeTab === "Active" && <P2PActiveTrading />}
      {activeTab === "Disputed" && <P2PDisputedTrading />}
      {activeTab === "Stuck" && <P2PStuckTrading />}
    </div>
  );
}