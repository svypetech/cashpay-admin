import StatCard from "../cards/StatsCard";
import { ArrowLeftRight, ExternalLink } from "lucide-react"

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
                {/* Transactions Section - spans 3 cols */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Transactions</h2>
                    <a href="#" className="text-blue-500 text-sm flex items-center">
                      View All
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">From → To</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Block#</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center">
                                <ArrowLeftRight className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="text-gray-600">0x90aCe6b6...f688</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">0xe0fb...2834f → 0x8a5b51...7B00C</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                                Success
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">Block #9432831</td>
                            <td className="px-4 py-3 text-sm text-gray-600">2h ago</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Health - spans 1 col */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold mb-4">Overall System Health</h2>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#eee" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#4263EB"
                          strokeWidth="10"
                          strokeDasharray="282.7"
                          strokeDashoffset="85"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">70</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button className="bg-blue-100 text-blue-600 px-6 py-2 rounded-md text-sm font-medium">
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Second Row - Users Table (2 cols) + Total Users (2 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Users */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold mb-1">Total Users</h2>
                  <p className="text-2xl font-bold mb-4">207,388</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>New Users</span>
                        <span>74,759</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-800 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Active Users</span>
                        <span>59,203</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Inactive Users</span>
                        <span>43,887</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0</span>
                    <span>20K</span>
                    <span>40K</span>
                    <span>60K</span>
                    <span>80K</span>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Users</h2>
                    <a href="#" className="text-blue-500 text-sm flex items-center">
                      View All
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">E-mail</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Transactions</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm font-medium">John Doe</td>
                            <td className="px-4 py-3 text-sm text-gray-600">johndoe@gmail.com</td>
                            <td className="px-4 py-3 text-sm text-gray-600">567</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                                Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
    );
}