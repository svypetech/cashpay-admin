import Image from "next/image";

type Coin = {
  name: string;
  image: string;
  price_change_percentage_24h: number;
};

interface CryptoCurrencyCardProps {
  coin: Coin;
}

export default function CryptoCurrencyCard({ coin }: CryptoCurrencyCardProps) {
  // Format percentage display
  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    const sign = isPositive ? "+" : "";
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Get color class based on percentage change
  const getPercentageColor = (percentage: number) => {
    return percentage >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center mb-4 gap-3">
        <Image 
          src={coin.image || "/placeholder.svg"} 
          alt={coin.name} 
          width={40} 
          height={40} 
          className="rounded-full" 
        />
        <div>
          <div className="text-sm text-gray-600">{coin.name}</div>
          <div 
            className={`text-xl font-bold font-[satoshi] ${getPercentageColor(coin.price_change_percentage_24h)}`}
          >
            {formatPercentage(coin.price_change_percentage_24h)}
          </div>
        </div>
      </div>
      <div className="h-32">
        <Image
          src="/icons/graph.svg"
          alt="Graph"
          width={200}
          height={100}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}