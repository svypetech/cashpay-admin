
import { ExternalLink } from "lucide-react";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Error from "../ui/Error";
import useFetchDashboardUsers from "@/src/hooks/Dashboard/useFetchDashboardUsers";
import ColourfulBlock from "../ui/ColourfulBlock";

const headings = ["Name", "Email", "Transactions", "Status"];

export default function UsersTableDashboard() {
  const { users, isLoading, isError } = useFetchDashboardUsers();
  // Function to get column width based on column index
  const getColumnWidthClass = (index: number): string => {
    switch (index) {
      case 0:
        return "w-[25%]"; // Name column
      case 1:
        return "w-[30%]"; // Email column (needs more space)
      case 2:
        return "w-[20%]"; // Transactions column (numeric values need less space)
      case 3:
        return "w-[25%]"; // Status column
      default:
        return "w-[25%]"; // Default equal distribution
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm md:p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <a
          href="/active-users"
          className="text-secondary text-sm flex items-center"
        >
          View All
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
      <div className="rounded-lg overflow-auto w-full">

        {isLoading ? <SkeletonTableLoader rowCount={3} headings={headings} />
        : isError ? 
        <Error text="Something went wrong" />
        : users.length === 0 ?
        <Error text="No data found" />
        :
          
      
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px]">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className={`p-2 sm:p-4 text-left ${getColumnWidthClass(
                    index
                  )}`}
                >
                  <span
                    className={`${index === 2 ? "relative left-[-5px]" : ""}`}
                  >
                    {heading}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px]"
                >
                  <td
                    className={`p-2 sm:p-3 font-satoshi font-bold text-primary ${getColumnWidthClass(
                      0
                    )}`}
                  >
                    {user.name.firstName ? user.name.firstName + " " + user.name.lastName : "N/A"}
                  </td>
                  <td
                    className={`p-2 sm:p-3 font-satoshi ${getColumnWidthClass(
                      1
                    )}`}
                  >
                    {user.email}
                  </td>
                  <td
                    className={`p-2 sm:p-3 font-satoshi  ${getColumnWidthClass(
                      2
                    )}`}
                  >
                    {user.transactionCount}
                  </td>
                  <td
                    className={`p-2 sm:p-3 font-satoshi ${getColumnWidthClass(
                      3
                    )}`}
                  >
                    <ColourfulBlock
                        className={`${
                          user.status === "Verified"
                            ? "bg-[#71FB5533] text-[#20C000]"
                            : "text-[#727272] bg-[#72727233]"
                        }`}
                        text={user.status}
                        size="sm"
                      ></ColourfulBlock>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
}
      </div>
    </div>
  );
}
