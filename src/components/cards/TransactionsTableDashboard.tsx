import useTransaction from "@/src/hooks/Transactions/transactionsManagement";
import { ArrowLeftRight, ExternalLink, ChevronRight } from "lucide-react";
import { shortenAddress, timeAgo } from "@/src/lib/functions";
import TransactionType from "@/src/Types/TransactionManagement";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
const headings = ["ID", "From → To", "Status", "Block#", "Date"];

export default function TransactionsTableDashboard() {
  const { transactions, loading, error } = useTransaction({page: 1, limit: 3});
  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow-sm md:p-4 p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <a
          href="/transactions"
          className="text-secondary text-sm flex items-center"
        >
          View All
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
      {loading ? (
        <SkeletonTableLoader headings={headings} rowCount={3} />
      ) : error ? (
        <div className="p-4 text-red-500 flex items-center justify-center h-[100px]">
          Error loading users
        </div>
      ) : (
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
              {Array.isArray(transactions) &&
                transactions.map((transaction: TransactionType, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="rounded-full p-1.5 bg-secondary2 mr-2">
                          <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {shortenAddress(transaction.id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] text-sm whitespace-nowrap">
                      {transaction.web3Data ? shortenAddress(transaction.web3Data.transaction.from) : "N/A"} →{" "}
                      {transaction.web3Data ? shortenAddress(transaction.web3Data.transaction.to): "N/A"}
                    </td>
                    <td className="p-3">
                      {transaction.status === "completed" ||
                      transaction.status === "Completed" ? (
                        <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                          {transaction.status[0].toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      ) : (
                        <span className="text-left text-[#727272] bg-[#72727233] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                          {transaction.status}
                        </span>
                      )}
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap font-medium">
                      {shortenAddress(
                        transaction.web3Data ? transaction.web3Data.transaction.blockHash : "N/A"
                      )}
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap">
                      {timeAgo(transaction.date)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}