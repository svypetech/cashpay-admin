export interface Wallet {
    userId: number;
    userName: {
      firstName: string;
      lastName: string;
    };
    image: string;
    cryptoHoldings: number;
    balances: {
      address: string;
      updated_at: string;
      next_update_at: string;
      quote_currency: string;
      chain_id: number;
      chain_name: string;
      items: BalanceItem[];
      pagination: null | any;
    };
    totalBalanceUSD: number;
    cardUser?: boolean; // Kept as optional since it was in your original interface but not in the sample data
  }
  
  export interface BalanceItem {
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    supports_erc: string[];
    logo_url: string;
    contract_display_name: string;
    logo_urls: {
      token_logo_url: string;
      protocol_logo_url: string | null;
      chain_logo_url: string;
    };
    last_transferred_at: string;
    block_height: number;
    native_token: boolean;
    type: string; // "cryptocurrency" | "dust" or other potential types
    is_spam: boolean;
    balance: string;
    balance_24h: string;
    quote_rate: number | null;
    quote_rate_24h: number | null;
    quote: number | null;
    pretty_quote: string | null;
    quote_24h: number | null;
    pretty_quote_24h: string | null;
    protocol_metadata: null | any;
    nft_data: null | any;
  }