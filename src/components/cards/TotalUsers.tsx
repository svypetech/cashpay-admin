"use client"

interface UserStats {
    totalUsers: number
    newUsers: number
    activeUsers: number
    inactiveUsers: number
}

interface TotalUsersCardProps {
    data: UserStats
}

export default function TotalUsersCard({ data }: TotalUsersCardProps) {
    const maxScale = 80000 // 80K is the max value shown on the scale

    // Function to format numbers with commas
    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    // Calculate percentage width for each bar
    const getBarWidth = (value: number) => {
        return (value / maxScale) * 100
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border font-[satoshi] border-gray-100">
            <div className="mb-6">
                <h2 className="text-gray-700 text-lg font-medium">Total Users</h2>
                <p className="text-primary text-4xl font-semibold font-[satoshi] mt-1">{formatNumber(data.totalUsers)}</p>
            </div>

            <div className="relative pr-5">
                {/* Grid lines */}
                <div
                    className="absolute top-0 bottom-0 left-0 right-0 pl-24 pointer-events-none"
                    style={{ zIndex: 1 }}
                >
                    <div className="relative h-full">
                        {[0, 23, 45, 69, 92].map((position) => (
                            <div
                                key={position}
                                className="absolute h-full border-l border-gray-200"
                                style={{ left: `${position}%`, width: 0 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Bars */}
                <div className="relative space-y-6 mb-6" style={{ zIndex: 2 }}>
                    {/* New Users Bar */}
                    <div className="flex items-center">
                        <div className="w-24 text-right pr-4 text-sm text-gray-600">New Users</div>
                        <div className="flex-1 relative">
                            <div className="h-3 bg-blue-800 rounded-full" style={{ width: `${getBarWidth(data.newUsers)}%` }}></div>
                            <span
                                className="absolute top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                                style={{ left: `${getBarWidth(data.newUsers)}%`, marginLeft: "8px" }}
                            >
                                {formatNumber(data.newUsers)}
                            </span>
                        </div>
                    </div>

                    {/* Active Users Bar */}
                    <div className="flex items-center">
                        <div className="w-24 text-right pr-4 text-sm text-gray-600">Active Users</div>
                        <div className="flex-1 relative">
                            <div
                                className="h-3 bg-blue-400 rounded-full"
                                style={{ width: `${getBarWidth(data.activeUsers)}%` }}
                            ></div>
                            <span
                                className="absolute top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                                style={{ left: `${getBarWidth(data.activeUsers)}%`, marginLeft: "8px" }}
                            >
                                {formatNumber(data.activeUsers)}
                            </span>
                        </div>
                    </div>

                    {/* Inactive Users Bar */}
                    <div className="flex items-center">
                        <div className="w-24 text-right pr-4 text-sm text-gray-600">Inactive Users</div>
                        <div className="flex-1 relative">
                            <div
                                className="h-3 bg-yellow-400 rounded-full"
                                style={{ width: `${getBarWidth(data.inactiveUsers)}%` }}
                            ></div>
                            <span
                                className="absolute top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                                style={{ left: `${getBarWidth(data.inactiveUsers)}%`, marginLeft: "8px" }}
                            >
                                {formatNumber(data.inactiveUsers)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between text-sm text-gray-500 pl-24">
                    <div>0</div>
                    <div>20K</div>
                    <div>40K</div>
                    <div>60K</div>
                    <div>80K</div>
                </div>
            </div>
        </div>
    )
}

