import { ArrowLeftRight, ExternalLink } from "lucide-react";

export default function TransactionsTableDashboarD() {

    return (
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Transactions</h2>
                    <a href="#" className="text-secondary text-sm flex items-center">
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
                                <div className="rounded-full p-2 bg-secondary2 mr-2">
                                  <ArrowLeftRight className="h-4 w-4 text-primary " />
                                </div>
                                <span className="text-gray-600">0x90aCe6b6...f688</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">0xe0fb...2834f → 0x8a5b51...7B00C</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs">
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
    )
}