import React from "react";
import ServerCard from "./ServerCard";

// Server data matching the exact values from the screenshot
const serverData = [
  {
    id: 1,
    uptime: 30,
    uptimeDuration: { days: 32, hours: 14 },
    cpuUsage: 70,
    maxThreshold: 85,
    memoryUsage: 10,
    memoryUsed: 78,
    hostedLocation: "Beijing, China",
    activeDuration: 23,
    p2pTrades: 400000,
    infoPosition: "right" as const
  },
  {
    id: 2,
    uptime: 70,
    uptimeDuration: { days: 32, hours: 14 },
    cpuUsage: 70,
    maxThreshold: 85,
    memoryUsage: 70,
    memoryUsed: 76,
    hostedLocation: "Beijing, China",
    activeDuration: 23,
    p2pTrades: 400000,
    infoPosition: "left" as const
  },
  {
    id: 3,
    uptime: 70,
    uptimeDuration: { days: 32, hours: 14 },
    cpuUsage: 70,
    maxThreshold: 85,
    memoryUsage: 70,
    memoryUsed: 76,
    hostedLocation: "Beijing, China",
    activeDuration: 23,
    p2pTrades: 400000,
    infoPosition: "right" as const
  },
  {
    id: 4,
    uptime: 70,
    uptimeDuration: { days: 32, hours: 14 },
    cpuUsage: 70,
    maxThreshold: 85,
    memoryUsage: 70,
    memoryUsed: 76,
    hostedLocation: "Beijing, China",
    activeDuration: 23,
    p2pTrades: 400000,
    infoPosition: "left" as const
  }
];

const SystemHealthSection: React.FC = () => {
  return (
    <div className="mt-6 px-2">
      {serverData.map(server => (
        <ServerCard
          key={server.id}
          serverId={server.id}
          uptime={server.uptime}
          uptimeDuration={server.uptimeDuration}
          cpuUsage={server.cpuUsage}
          maxThreshold={server.maxThreshold}
          memoryUsage={server.memoryUsage}
          memoryUsed={server.memoryUsed}
          hostedLocation={server.hostedLocation}
          activeDuration={server.activeDuration}
          p2pTrades={server.p2pTrades}
          infoPosition={server.infoPosition}
        />
      ))}
    </div>
  );
};

export default SystemHealthSection;