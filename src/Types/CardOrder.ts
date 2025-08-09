export interface CardOrder {
  orderId: string;
  userId: string;
  cardType: string;
  date: string; // ISO date string
  deliveryAddress: string | null;
  orderStatus: string;
  cardStatus: string;
  paymentMethod: string;
  userDetails: {
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
    image: string;
    joinDate: string; // ISO date string
  };
}