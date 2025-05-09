import StatCard from "../cards/StatsCard";
import { ArrowLeftRight, ExternalLink, User } from "lucide-react"
import TotalUsersCard from "../cards/TotalUsers";
import SystemHealthGauge from "../cards/SystemHealth";
import TransactionsTableDashboard from "../cards/TransactionsTableDashboard";
import UsersTableDashboard from "../cards/UsersTableDashboard";

const userStatsData = {
  totalUsers: 207388,
  newUsers: 74779,
  activeUsers: 56635,
  inactiveUsers: 43887,
}

export default function Overview() {

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
        <StatCard icon="/icons/dashboard1.svg" label="Users" value="400K" />
        <StatCard icon="/icons/dashboard2.svg" label="Transactions" value="400K" />
        <StatCard icon="/icons/dashboard3.svg" label="P2P trades" value="400K" />
        <StatCard icon="/icons/dashboard4.svg" label="Card Orders" value="105K" />
      </div>

      {/* First Row - Transactions (3 cols) + System Health (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <TransactionsTableDashboard />
        <SystemHealthGauge value={75} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TotalUsersCard data={userStatsData} />
        <UsersTableDashboard />

      </div>
    </div>
  );
}