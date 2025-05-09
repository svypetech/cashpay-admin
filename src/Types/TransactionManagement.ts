interface Wallet {
    id: string;
    userId: string;
    publicAddress: string;
}

interface Web3Transaction {
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: string;
    to: string;
    transactionIndex: string;
    value: string;
    type: string;
    chainId: string;
    v: string;
    r: string;
    s: string;
    data: string;
  }
  
  interface Web3Data {
    success: boolean;
    transaction: Web3Transaction;
  }
  

export default interface Transaction {
    id: string;
    userId: string;
    to: string;
    token: string;
    tokenName: string;
    amount: string;
    transactionHash: string;
    type: string; // "send" or "receive"
    wallet: Wallet;
    date: string; // ISO string format
    status: string;
    web3Data: Web3Data;
}