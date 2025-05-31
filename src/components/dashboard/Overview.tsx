import StatCard from "../cards/StatsCard";
import TotalUsersCard from "../cards/TotalUsers";
import SystemHealthGauge from "../cards/SystemHealth";
import TransactionsTableDashboard from "../cards/TransactionsTableDashboard";
import UsersTableDashboard from "../cards/UsersTableDashboard";

import Error from "../ui/Error";

import SystemHealthSkeleton from "../skeletons/SystemHealthSkeleton";
import useFetchDashboardCards from "@/src/hooks/Dashboard/useFetchDashboardCards";
import useFetchSystemHealth from "@/src/hooks/Dashboard/useFetchSystemHealth";

export default function Overview() {
  const { dashboardCards, isLoading, isError } = useFetchDashboardCards();
  const {
    systemHealth,
    isLoading: isLoadingSystemHealth,
    isError: isErrorSystemHealth,
  } = useFetchSystemHealth();

  return (
    <div>
      {/* Stats Cards */}

      {isError ? (
        <Error text="Something went wrong" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
          <StatCard
            icon="/icons/dashboard1.svg"
            label="Users"
            value={dashboardCards.userCount}
            isLoading={isLoading}
          />
          <StatCard
            icon="/icons/dashboard2.svg"
            label="Transactions"
            value={dashboardCards.transactionCount}
            isLoading={isLoading}
          />
          <StatCard
            icon="/icons/dashboard3.svg"
            label="P2P trades"
            value={dashboardCards.tradeCount}
            isLoading={isLoading}
          />
          <StatCard
            icon="/icons/dashboard4.svg"
            label="Card Orders"
            value={dashboardCards.cardCount}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* First Row - Transactions (3 cols) + System Health (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <TransactionsTableDashboard />
        {isLoadingSystemHealth ? (
          <SystemHealthSkeleton />
        ) : isErrorSystemHealth ? (
          <Error text="Something went wrong" />
        ) : (
          <SystemHealthGauge value={systemHealth} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TotalUsersCard />
        <UsersTableDashboard />
      </div>
    </div>
  );
}
