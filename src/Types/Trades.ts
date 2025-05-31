export default interface Trade {
    hash: string;
    tradeId: string;
    sellerId: string;
    buyerId: string;
    amountt: number;
    currency: string;
    payment: string;
    status: string;
    reason?:string
}