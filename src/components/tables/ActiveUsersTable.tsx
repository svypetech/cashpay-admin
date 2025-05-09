"use client";
import React, { useState } from "react";
import { User } from "@/src/Types/User";
import UserProfileSidebar from "../users/UserInfoSidebar";

interface Props {
  headings: string[];
  data: User[];
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format the date as YYYY-MM-DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};

const ActiveUsersTable: React.FC<Props> = ({ data, headings }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState<User>({} as User);
  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div className="rounded-lg overflow-x-auto w-full min-h-[200px]">
        <table className="w-full text-left table-auto min-w-[800px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
              <th className="p-4 sm:p-6 text-left font-[700] w-[15%]">
                {headings[0]}
              </th>
              <th className="p-4 sm:p-6 text-left font-[700] w-[20%]">
                {headings[1]}
              </th>
              <th className="p-4 sm:p-6 text-left font-[700] w-[20%]">
                {headings[2]}
              </th>
              <th className="p-4 sm:p-6 text-left font-[700] w-[20%]">
                {headings[3]}
              </th>
              <th className="p-4 sm:p-6 text-left font-[700] w-[25%]">
                {headings[4]}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((user, index) => (
                <tr
                  onClick={() => {
                    setUser(user);
                    setShowSidebar(true);
                  }}
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px] cursor-pointer"
                >
                  <td className="p-4 sm:p-6 font-satoshi min-w-[100px] break-words whitespace-nowrap">
                    {user._id}
                  </td>
                  <td className="p-4 sm:p-6 font-satoshi font-bold text-primary min-w-[120px] break-words whitespace-nowrap">
                    {user.name
                      ? user.name.firstName + " " + user.name.lastName
                      : "N/A"}
                  </td>
                  <td className="p-4 sm:p-6 font-satoshi min-w-[150px] break-words whitespace-nowrap">
                    {user.lastLoginDate
                      ? formatDate(user.lastLoginDate)
                      : "N/A"}
                  </td>
                  <td className="p-4 sm:p-6 font-satoshi min-w-[100px] whitespace-nowrap ">
                    <span className="relative left-[2px]">{user.totalLogin ? user.totalLogin : "N/A"}</span>
                  </td>
                  <td className="p-4 sm:p-6 font-satoshi min-w-[120px] whitespace-nowrap ">
                    {user.sessionDuration ? user.sessionDuration : "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <UserProfileSidebar
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
          user={user}
        />
      </div>
    </div>
  );
};

export default ActiveUsersTable;