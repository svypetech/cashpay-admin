import React from "react";
import Image from "next/image";
import SystemHealthGauge from "../../ui/Meter";

interface ServerCardProps {
  serverId: number;
  uptime: number;
  uptimeDuration: {
    days: number;
    hours: number;
  };
  cpuUsage: number;
  maxThreshold: number;
  memoryUsage: number;
  memoryUsed: number;
  hostedLocation: string;
  activeDuration: number;
  p2pTrades: number;
  infoPosition: "left" | "right";
}

const ServerCard: React.FC<ServerCardProps> = ({
  serverId,
  uptime,
  uptimeDuration,
  cpuUsage,
  maxThreshold,
  memoryUsage,
  memoryUsed,
  hostedLocation,
  activeDuration,
  p2pTrades,
  infoPosition
}) => {
  // Metric card base component for reuse
  const MetricCard = ({ 
    title, 
    value, 
    footerText, 
    footerValue 
  }: { 
    title: string, 
    value: number, 
    footerText: string, 
    footerValue: string | number 
  }) => (
    <div className="bg-white rounded-lg border-[1px] border-black/10 p-4 pb-6 h-[360px] w-full flex flex-col shadow-[0px_0px_3px_0px_rgba(0,0,0,0.15)]">
      <p className="text-base font-[700] text-center mb-6">{title}</p>
      {/* Smaller gauge container */}
      <div className="h-[170px] flex items-center justify-center">
        <div className="w-[170px]">
          <SystemHealthGauge value={value} />
        </div>
      </div>
      <p className="text-[16px] text-center mt-[40px]">
        {footerText === "" ? (
          <>
            <span className="font-bold">{uptimeDuration.days}</span> Days,{" "}
            <span className="font-bold">{uptimeDuration.hours}</span> Hours
          </>
        ) : (
          <>
            {footerText} <span className="font-bold">{footerValue}</span>
          </>
        )}
      </p>
    </div>
  );

  // Info card with location
  const LocationCard = () => (
    <div className="bg-white rounded-lg border-[1px] border-black/10 p-4 sm:p-6 flex items-center h-[104px]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
        <Image src="/icons/location.svg" alt="Location" width={20} height={20} />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-500">Hosted Location</p>
        <p className="text-lg sm:text-xl font-semibold text-blue-900">{hostedLocation}</p>
      </div>
    </div>
  );

  // Info card with active duration
  const DurationCard = () => (
    <div className="bg-white rounded-lg border-[1px] border-black/10 p-4 sm:p-6 flex items-center h-[104px]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
        <Image src="/icons/clock.svg" alt="Clock" width={20} height={20} />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-500">Active Duration</p>
        <p className="text-lg sm:text-xl font-semibold text-blue-900">{activeDuration} hours</p>
      </div>
    </div>
  );

  // Info card with p2p trades
  const TradesCard = () => (
    <div className="bg-white rounded-lg border-[1px] border-black/10 p-4 sm:p-6 flex items-center h-[104px]">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
        <Image src="/icons/group.svg" alt="Trades" width={20} height={20} />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-500">P2P Trades</p>
        <p className="text-lg sm:text-xl font-semibold text-blue-900">{p2pTrades.toLocaleString('en-US')}</p>
      </div>
    </div>
  );

  return (
    <div className="mb-16 w-full">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Server {serverId}</h3>
      
      {/* Main grid container for entire server section */}
      <div className={`grid gap-6 ${
        infoPosition === "left" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
      }`}>
        {/* Info Cards (Left Position) */}
        {infoPosition === "left" && (
          <div className="flex flex-col gap-6">
            <LocationCard />
            <DurationCard />
            <TradesCard />
          </div>
        )}
        
        {/* Metric Cards - Using grid to arrange them */}
        <div className={`col-span-1 ${infoPosition === "left" ? "md:col-span-1 lg:col-span-1" : "md:col-span-1 lg:col-span-1"}`}>
          <MetricCard 
            title="Uptime" 
            value={uptime} 
            footerText=""
            footerValue=""
          />
        </div>
        
        <div className={`col-span-1 ${infoPosition === "left" ? "md:col-span-1 lg:col-span-1" : "md:col-span-1 lg:col-span-1"}`}>
          <MetricCard 
            title="CPU Usage" 
            value={cpuUsage} 
            footerText="Max Threshold:"
            footerValue={`${maxThreshold}%`}
          />
        </div>
        
        <div className={`col-span-1 ${infoPosition === "left" ? "md:col-span-1 lg:col-span-1" : "md:col-span-1 lg:col-span-1"}`}>
          <MetricCard 
            title="Memory Usage" 
            value={memoryUsage} 
            footerText="Used:"
            footerValue={`${memoryUsed}%`}
          />
        </div>
        
        {/* Info Cards (Right Position) */}
        {infoPosition === "right" && (
          <div className="flex flex-col gap-6">
            <LocationCard />
            <DurationCard />
            <TradesCard />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerCard;