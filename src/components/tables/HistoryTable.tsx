import { getStatusColors } from "@/src/components/utils/GetBlockColor";
import ColourfulBlock from "../ui/ColourfulBlock";

interface AlertHistory {
  alertId: string;
  ruleName: string;
  triggeredOn: string;
  status: string;
  actionTaken: string;
  resolver: string;
}

export default function HistoryTable({ headings, data }: { headings: string[], data: AlertHistory[] }) {
  return (
    <div className="flex-1 rounded-lg w-full py-5">
      <div className="rounded-lg overflow-x-auto">
        <table className="w-full text-left table-auto min-w-[1000px]">
          <thead className="bg-secondary/10">
            <tr>
              {headings.map((heading, index) => (
                <th key={index} className="py-5 px-4 text-left font-[700]">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((alert, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-6 px-4">{alert.alertId}</td>
                <td className="py-6 px-4">{alert.ruleName}</td>
                <td className="py-6 px-4">{alert.triggeredOn}</td>
                <td className="py-6 px-4">
                  <ColourfulBlock 
                    className={`${getStatusColors(alert.status)} rounded-[12px] px-[16px] py-[8px] text-center relative left-[-5px]`}
                    text={alert.status}
                  />
                </td>
                <td className="py-6 px-4">{alert.actionTaken}</td>
                <td className="py-6 px-4">{alert.resolver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}