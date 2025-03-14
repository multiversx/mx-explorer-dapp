import { Address } from '@multiversx/sdk-core';

function canTransformToPublicKey(address: string) {
  try {
    const checkAddress = Address.newFromBech32(address);

    return Boolean(checkAddress.bech32());
  } catch {
    return false;
  }
}

export function addressIsBech32(destinationAddress: string) {
  const isValidString = /^\w+$/.test(destinationAddress);

  return isValidString && canTransformToPublicKey(destinationAddress);
}
