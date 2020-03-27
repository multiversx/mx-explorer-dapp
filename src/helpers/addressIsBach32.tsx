import cryptoCore from 'lib/cryptoCore';

function canTransformToPublicKey(address: string) {
  try {
    const canTransform = cryptoCore.newAccount().hexPublicKeyFromAddress(address);
    return Boolean(canTransform);
  } catch {
    return false;
  }
}

export default function addressIsBach32(destinationAddress = '') {
  const isValidBach = !(
    !destinationAddress ||
    !destinationAddress.startsWith('erd') ||
    destinationAddress.length !== 62 ||
    /^\w+$/.test(destinationAddress) !== true
  );
  return isValidBach && canTransformToPublicKey(destinationAddress);
}
