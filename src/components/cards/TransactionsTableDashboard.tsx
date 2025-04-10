import { ArrowLeftRight, ExternalLink, ChevronRight } from "lucide-react"

const headings = ["ID", "From → To", "Status", "Block#", "Date"]
const data = [
  {
    id: "0x90afca66...f688",
    from: "0xe0fb...2834f",
    to: "0x8a5b...7B00C",
    status: "Success",
    block: "Block #9432831",
    date: "2h ago",
  },
  {
    id: "0x90afca66...f688",
    from: "0xe0fb...2834f",
    to: "0x8a5...7B00C",
    status: "Success",
    block: "Block #9432831",
    date: "2h ago",
  },
  {
    id: "0x90afca66...f688",
    from: "0xe0fb...2834f",
    to: "0x8a5...7B00C",
    status: "Success",
    block: "Block #9432831",
    date: "2h ago",
  },
]

export default function TransactionsTableDashboard() {
  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow-sm md:p-4 p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <a href="#" className="text-secondary text-sm flex items-center">
          View All
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block rounded-lg overflow-hidden w-full">
        <table className="w-full text-left">
          <thead className="bg-secondary/10">
            <tr className="text-sm">
              {headings.map((heading, index) => (
                <th key={index} className="p-3 text-left font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((transaction, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="rounded-full p-1.5 bg-secondary2 mr-2">
                        <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-primary">{transaction.id}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <span className="text-gray-600">
                      {transaction.from} → {transaction.to}
                    </span>
                  </td>
                  <td className="p-3">
                    {transaction.status === "Success" ? (
                      <span className="inline-flex text-xs bg-[#71FB5533] text-[#20C000] px-3 py-1 rounded-full font-medium">
                        {transaction.status}
                      </span>
                    ) : (
                      <span className="inline-flex text-xs text-[#727272] bg-[#72727233] px-3 py-1 rounded-full font-medium">
                        {transaction.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{transaction.block}</td>
                  <td className="p-3 text-sm text-gray-600">{transaction.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Shown only on mobile */}
      <div className="md:hidden space-y-3">
        {Array.isArray(data) &&
          data.map((transaction, index) => (
            <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="rounded-full p-1.5 bg-secondary2 mr-2">
                    <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-primary">{transaction.id}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500 mb-0.5">From → To</p>
                  <p className="text-gray-700">
                    {transaction.from} → {transaction.to}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 mb-0.5">Status</p>
                  {transaction.status === "Success" ? (
                    <span className="inline-flex text-xs bg-[#71FB5533] text-[#20C000] px-2 py-0.5 rounded-full">
                      {transaction.status}
                    </span>
                  ) : (
                    <span className="inline-flex text-xs text-[#727272] bg-[#72727233] px-2 py-0.5 rounded-full">
                      {transaction.status}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-gray-500 mb-0.5">Block#</p>
                  <p className="text-gray-700">{transaction.block}</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-0.5">Date</p>
                  <p className="text-gray-700">{transaction.date}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}