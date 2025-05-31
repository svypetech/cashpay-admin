
import CryptoCurrencyCardSkeleton from "../skeletons/CryptoCurrencyCardSkeleton";
import CryptoCurrencyCard from "../ui/CryptoCurrencyCard";
import Error from "../ui/Error";

type Coin = {
  name: string;
  image: string;
  price_change_percentage_24h: number;
};

interface MostTradedCryptoCurrenciesProps {
  coins: Coin[];
  isLoading: boolean;
  isError: boolean;
}

export default function MostTradedCryptocurrencies({
  coins,
  isLoading,
  isError,
}: MostTradedCryptoCurrenciesProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 font-[satoshi]">
        Most Traded Cryptocurrencies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          // Show skeleton cards while loading
          Array(3)
            .fill(0)
            .map((_, index) => <CryptoCurrencyCardSkeleton key={index} />)
        ) : isError ? (
          // Show error message if error occurred
          <div className="col-span-3">
            <Error text="Failed to load cryptocurrency data" />
          </div>
        ) : (
          // Show actual cards when data is loaded
          coins.map((coin: Coin, index: number) => (
            <CryptoCurrencyCard key={index} coin={coin} />
          ))
        )}
      </div>
    </div>
  );
}
