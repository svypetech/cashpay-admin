"use client";

import { User } from "@/src/Types/User";

interface Props {
  headings: string[];
  data: User[];
}

const UserEngagementTable: React.FC<Props> = ({ data, headings }) => {
  return (
    <div className={`flex-1 rounded-lg w-full py-5`}>
      {/* Table */}
      <div className="rounded-lg overflow-x-auto w-full min-h-[200px]">
        <table className="w-full text-left table-fixed min-w-[1000px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] py-3 sm:py-4 px-2 sm:px-4">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className="px-2 sm:px-4 py-3 sm:py-4 text-left w-1/5 sm:w-2/6"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px] "
                >
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi min-w-2/6 break-words xl:whitespace-nowrap">
                    {(user._id)}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary w-3/6 min-w-0 break-words">
                    {user.name
                      ? user.name.firstName + " " + user.name.lastName
                      : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi w-2/6 min-w-0 break-words">
                    {user.loginFrequency ? user.loginFrequency.toFixed(4) : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi w-[120px] min-w-0">
                    {user.averageTime ? user.averageTime : "N/A"}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-3 sm:py-4 font-satoshi ${
                      user.lastLoginDate ? "w-[150px]" : "w-1/6 min-w-0"
                    }`}
                  >
                    {user.lastActivity ? user.lastActivity : "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserEngagementTable;