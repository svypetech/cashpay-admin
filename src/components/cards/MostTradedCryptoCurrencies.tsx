import Image from "next/image"

export default function MostTradedCryptocurrencies() {
  const cryptocurrencies = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      percentage: "48.2%",
      icon: "/icons/bitcoin.svg",
      iconBg: "bg-orange-400",
      chartSrc: "/placeholder.svg?height=100&width=200",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      percentage: "48.2%",
      icon: "/icons/ethereum.svg",
      iconBg: "bg-gray-300",
      chartSrc: "/placeholder.svg?height=100&width=200",
    },
    {
      name: "Tether",
      symbol: "USDT",
      percentage: "48.2%",
      icon: "/icons/tether.svg",
      iconBg: "bg-emerald-400",
      chartSrc: "/placeholder.svg?height=100&width=200",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 font-[satoshi]">Most Traded Cryptocurrencies</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cryptocurrencies.map((crypto, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center mb-4 gap-3">
              <Image src={crypto.icon || "/placeholder.svg"} alt={crypto.name} width={40} height={40} className="" />
              <div>
                <div className="text-sm text-gray-600">{crypto.name}</div>
                <div className="text-xl font-bold text-primary font-[satoshi]">{crypto.percentage}</div>
              </div>
            </div>
            <div className="h-32">
              <Image
                src="/icons/graph.svg"
                alt={`${crypto.name} chart`}
                width={200}
                height={100}
                className="w-full h-full"
              />
              {/* Replace with actual SVG chart */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
