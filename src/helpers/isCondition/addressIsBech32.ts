import { Address } from '@multiversx/sdk-core';

function canTransformToPublicKey(address: string) {
  try {
    return Address.isValid(address);
  } catch {
    return false;
  }
}

export function addressIsBech32(destinationAddress: string) {
  const isValidString = /^\w+$/.test(destinationAddress);

  return isValidString && canTransformToPublicKey(destinationAddress);
}
