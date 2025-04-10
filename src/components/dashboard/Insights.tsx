import MostTradedCryptocurrencies from "../cards/MostTradedCryptoCurrencies"
import TransactionFrequency from "../cards/TransactionFrequency"
import NewUsers from "../cards/NewUsersTable"
import UserInsights from "../cards/UserInsights"

export default function UserInsightsPage() {
  return (
      <main className="container mx-auto md:px-4 py-6">

        {/* Top Row - Cryptocurrencies and Transaction Frequency */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3">
            <MostTradedCryptocurrencies />
          </div>
          <div className="lg:col-span-2">
            <TransactionFrequency />
          </div>
        </div>

        {/* Bottom Row - New Users and User Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <NewUsers />
          </div>
          <div>
            <UserInsights />
          </div>
        </div>
      </main>
  )
}
