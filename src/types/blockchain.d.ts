// Transaction types
export interface TokenTransfer {
  mint: string;
  toUserAccount: string;
  fromUserAccount: string;
  amount: number;
}

export interface TokenBalance {
  mint: string;
  owner: string;
  uiAmount: number;
}

export interface TransactionMeta {
  preTokenBalances: TokenBalance[];
  postTokenBalances: TokenBalance[];
}
