import MostTradedCryptocurrencies from "../cards/MostTradedCryptoCurrencies";
import TransactionFrequency from "../cards/TransactionFrequency";
import NewUsers from "../cards/NewUsersTable";
import UserInsights from "../cards/UserInsights";
import Error from "../ui/Error";
import useFetchDashboardUsers from "@/src/hooks/Dashboard/useFetchUserInsights";
import useFetchMostTradedCoins from "@/src/hooks/Dashboard/useFetchMostTradedCoins";
import UserInsightsSkeleton from "../skeletons/UserInsightsSkeleton";
import useFetchTransactionFrequency from "@/src/hooks/Dashboard/useFetchTransactionFrequency";
import TransactionFrequencySkeleton from "../skeletons/TransactionFrequencyCardSkeleton";

export default function UserInsightsPage() {
  const { userInsights, isLoading, isError } = useFetchDashboardUsers();
  const {mostTradedCoins,isLoading:isLoadingCoins,isError:isCoinsError} = useFetchMostTradedCoins()
  const {
    transactionFrequencyData,
    isLoading: isLoadingTxFrequency,
    isError: isTxFrequencyError,
  } = useFetchTransactionFrequency();
  
  return (
    <main className="container mx-auto md:px-4 py-6">
      {/* Top Row - Cryptocurrencies and Transaction Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <MostTradedCryptocurrencies coins={mostTradedCoins} isLoading={isLoadingCoins} isError={isCoinsError} />
        </div>
        <div className="lg:col-span-2">
          {isLoadingTxFrequency ? (
            <TransactionFrequencySkeleton />
          ) : isTxFrequencyError ? (
            <Error text="Failed to load transaction frequency data" />
          ) : transactionFrequencyData ? (
            <TransactionFrequency data={transactionFrequencyData} />
          ) : (
            <Error text="No transaction frequency data available" />
          )}
        </div>
      </div>

      {/* Bottom Row - New Users and User Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewUsers />

        <div>
          {isLoading ? (
            <UserInsightsSkeleton />
          ) : isError ? (
            <Error text="Something went wrong" />
          ) : (
            <UserInsights userInsights={userInsights} />
          )}
        </div>
      </div>
    </main>
  );
}
