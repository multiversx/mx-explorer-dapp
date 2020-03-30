import { useGlobalState } from './../context';
import cryptoCore from './../lib/cryptoCore';
import addressIsHash from './addressIsHash';

function canTransformToPublicKey(address: string) {
  try {
    const canTransform = cryptoCore.newAccount().hexPublicKeyFromAddress(address);
    return Boolean(canTransform);
  } catch {
    return false;
  }
}

function addressIsBach32(destinationAddress = '') {
  const isValidBach = !(
    !destinationAddress ||
    !destinationAddress.startsWith('erd') ||
    destinationAddress.length !== 62 ||
    /^\w+$/.test(destinationAddress) !== true
  );
  return isValidBach && canTransformToPublicKey(destinationAddress);
}

export default function useBach32() {
  const {
    activeTestnet: { hasBach32 },
  } = useGlobalState();

  const getAddress = (publicKey: string) =>
    addressIsHash(publicKey) && hasBach32
      ? (cryptoCore.newAccount() as any).addressFromHexPublicKey(publicKey)
      : publicKey;

  const getPublicKey = (address = '') =>
    addressIsBach32(address) && hasBach32
      ? (cryptoCore.newAccount() as any).hexPublicKeyFromAddress(address)
      : address;

  return {
    getAddress,
    getPublicKey,
  };
}
