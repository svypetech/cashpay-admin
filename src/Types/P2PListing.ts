export interface Listing {
  id: string;
  createdBy: string;
  type: "Buy" | "Sell" | string;
  currency: string;
  currencyIcon: string;
  currencyContract: string;
  paymentMethod: "Card" | "Bank Transfer" | "Cash" | string;
  address: string;
  coordinates: [number, number];
  securityDeposit: number;
  branch: string | null;
  securityDepositCurreny: string;
  priceType: "Fixed" | "Floating" | string;
  offeredPrice: string;
  offeredCurrency: string;
  minPrice?: number;
  maxPrice?: number;
  paymentWindow: string;
  customPaymentInstructions: string;
  addVisibility: boolean;
  autoCancelTime: string;
  autoText: string;
  updatedAt: string;
  createdAt: string;
  
  // Additional fields from the table component
  listingID?: string; // This appears to be the same as id
  buyerID?: string;
  status?: "active" | "inactive" | string;
}

// Helper type for listing summaries (used in tables)
export interface ListingSummary {
  listingID: string;
  createdBy: string;
  buyerID: string;
  type: string;
  currency: string;
  status: string;
}