"use client"

import Tabs from "@/src/components/ui/Tabs";
import ActiveUsers from "@/src/components/users/ActiveUsers";
import UserEngagement from "@/src/components/users/UserEngagement";
import { useState } from "react";

const tabs = ["Active Users", "User Engagement"]

export default function ActiveUsersPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
      <main className="px-6 sm:px-10 py-6">
        {/* Navigation Tabs */}
        <div className="w-dull flex justify-center items-center mb-4">
            <Tabs
              tabs={tabs}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              size="normal"
            />
          </div>

        {/* Users Table */}
        {activeTab.toLowerCase() === "active users" ? (
          <ActiveUsers />
        ) : (
          <UserEngagement />
        )}

      </main>
  )
}