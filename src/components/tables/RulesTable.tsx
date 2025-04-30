import Image from "next/image";
interface AlertRule {
  ruleId: string;
  ruleName: string;
  metric: string;
  threshold: string;
  duration: string;
  notifications: string;
  recipient: string;
}



export default function RulesTable({ headings, data, onEditRule }: { headings: string[], data: AlertRule[], onEditRule: (rule: AlertRule) => void }) {
    return (
      <div className="flex-1 rounded-lg w-full py-5">
        <div className="rounded-lg overflow-x-auto">
          <table className="w-full text-left table-auto min-w-[1000px]">
            <thead className="bg-secondary/10">
              <tr>
                {headings.map((heading, index) => (
                  <th key={index} className="p-4 text-left font-[700]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((rule, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-4">{rule.ruleId}</td>
                  <td className="p-4">{rule.ruleName}</td>
                  <td className="p-4">{rule.metric}</td>
                  <td className="p-4">{rule.threshold}</td>
                  <td className="p-4">{rule.duration}</td>
                  <td className="p-4">{rule.notifications}</td>
                  <td className="p-4">{rule.recipient}</td>
                  <td className="p-4 text-center">
                    <button className="cursor-pointer" onClick={() => onEditRule(rule)}>
                      <Image src="/icons/edit.svg" alt="Edit" width={24} height={24} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }