import { Address } from '@multiversx/sdk-core/out';

export const isContract = (initiator: string | undefined) => {
  if (!initiator) {
    return false;
  }

  try {
    return Address.newFromBech32(initiator).isSmartContract();
  } catch {
    return false;
  }
};
