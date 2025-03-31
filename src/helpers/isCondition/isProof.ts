import { NftType, TokenType, TransactionTokenArgumentType } from 'types';

export const isProof = (
  nftDetails?: NftType | TokenType | TransactionTokenArgumentType
) => {
  if (!nftDetails) {
    return false;
  }

  return String(nftDetails?.hash).startsWith('proof:');
};
