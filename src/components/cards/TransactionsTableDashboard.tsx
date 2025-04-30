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
      <div className="block rounded-lg overflow-auto w-full">
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
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">
                      {transaction.from} → {transaction.to}
                  </td>
                  <td className="p-3">
                    {transaction.status === "Success" ? (
                      <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                        {transaction.status}
                      </span>
                    ) : (
                      <span className="text-left text-[#727272] bg-[#72727233] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                        {transaction.status}
                      </span>
                    )}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap font-medium">{transaction.block}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">{transaction.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}