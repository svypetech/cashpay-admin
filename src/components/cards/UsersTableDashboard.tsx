import { ExternalLink } from "lucide-react";

const headings = ["Name", "Email", "Transactions", "Status"];
const data = [{ name: "John Doe", email: "johndoe@gmail.com", transactions: 567, status: "Verified" },
{ name: "John Doe", email: "johndoe@gmail.com", transactions: 567, status: "Verified" },
{ name: "John Doe", email: "johndoe@gmail.com", transactions: 567, status: "Verified" }
]

export default function UsersTableDashboard() {

  return (
    <div className="bg-white rounded-lg shadow-sm md:p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <a href="/active-users" className="text-secondary text-sm flex items-center">
          View All
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
      <div className="rounded-lg overflow-auto w-full">
        <table className="w-full text-left table-fixed min-w-30">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] p-2 sm:p-4">
              {headings.map((heading, index) => (
                <th key={index} className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6 break-words">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((user, index) => (
                <tr
                  key={index} className="border-b text-[12px] sm:text-[16px]">
                  <td className={`p-2 sm:p-4 font-satoshi font-bold text-primary w-3/6 min-w-0 break-words`}>
                    {user.name}
                  </td>
                  <td className="p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words">
                    {user.email}
                  </td>
                  <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0">
                    {user.transactions}
                  </td>
                  <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0 relative">
                    {user.status === "Verified" ? (
                      <span className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap bg-[#71FB5533] text-[#20C000] rounded-xl font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] whitespace-nowrap text-[#727272] bg-[#72727233] rounded-xl font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}