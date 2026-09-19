import { MAIN_CHAIN_SHARD_IDS, SOVEREIGN_BRIDGE_ADDRESSES } from 'appConstants';
import { faLinkHorizontal } from 'icons/duotone';
import { UITransactionType } from 'types';

export const getTransactionBridgeDetails = (
  transaction: UITransactionType,
  isSovereign: boolean
) => {
  // From Sovereign to Main Chain
  if (isSovereign) {
    if (transaction.function === 'deposit') {
      return { text: 'Send', icon: faLinkHorizontal };
    }

    if (
      SOVEREIGN_BRIDGE_ADDRESSES.includes(transaction.sender) &&
      MAIN_CHAIN_SHARD_IDS.includes(transaction.senderShard) &&
      transaction.function === 'MultiESDTNFTTransfer'
    ) {
      return { text: 'Receive', icon: faLinkHorizontal };
    }
  }

  // From Main Chain to Sovereign
  if (transaction.function === 'deposit') {
    return { text: 'Send', icon: faLinkHorizontal };
  }
  if (transaction.function === 'registerBridgeOps') {
    return { text: 'Validate', icon: faLinkHorizontal };
  }
  if (transaction.function === 'executeBridgeOps') {
    return { text: 'Receive', icon: faLinkHorizontal };
  }

  return {};
};
