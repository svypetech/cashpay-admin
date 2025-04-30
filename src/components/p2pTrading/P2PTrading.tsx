"use client";

import { useState } from "react";
import P2PActiveTrading from "./P2PActiveTrading";
import P2PDisputedTrading from "./P2PDisputedTrading";
import P2PStuckTrading from "./P2PStuckTrading";

const navigationTabs = [
    { id: "active", title: "Active" },
    { id: "disputed", title: "Disputed" },
    { id: "stuck", title: "Stuck" },
];

export default function P2PTrading() {
    const [activeTab, setActiveTab] = useState("active");
    
    return (
        <div>
            {/* Navigation Tabs */}
            <div className="w-full flex items-center mb-4">
                <div className="flex w-fit">
                    {navigationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-black ${activeTab === tab.id
                                ? "border-b-2 border-primary font-semibold"
                                : "hover:text-gray-700 cursor-pointer"
                                }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Render the active tab component */}
            {activeTab === "active" && <P2PActiveTrading />}
            {activeTab === "disputed" && <P2PDisputedTrading />}
            {activeTab === "stuck" && <P2PStuckTrading />}
        </div>
    );
}