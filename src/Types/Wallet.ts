

export interface Wallet {
  data: UserData;
}

export interface UserData {
  userId: number;
  user_id: string;
  userName: UserName;
  userStatus: string;
  image: string;
  cryptoHoldings: number;
  balances: Balances;
  totalBalanceUSD: number;
}

export interface UserName {
  firstName: string;
  lastName: string;
}

export interface Balances {
  publicAddress: string;
  tokens: Token[];
}

export interface Token {
  contractAddress: string;
  balance: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  id: string;
  usdPriceOf1Coin: number;
  price_change_24h_in_usd: number;
  price_change_percentage_1h_in_usd: number;
  quote: string;
  convertedBalance: string;
  totalUsdPrice: string;
}
