export interface AccountType {
  address: string;
  balance: string;
  nonce: number;
  code?: string;
}

export interface TokenType {
  tokenIdentifier: string;
  tokenName: string;
  balance?: string;
  ownerAddress: string;
  mintedValue: string;
  burntValue: string;
  canBurn: boolean;
  canChangeOwner: boolean;
  canFreeze: boolean;
  canMint: boolean;
  canPause: boolean;
  canUpgrade: boolean;
  canWipe: boolean;
  isPaused: boolean;
}
