import { useGlobalState } from 'context';
import cryptoCore from 'lib/cryptoCore';
import isHash from './isHash';
import addressIsBach32 from './addressIsBach32';

export default function useBach32() {
  const {
    activeTestnet: { bach32LocalTransform },
  } = useGlobalState();

  const getAddress = (publicKey: string) =>
    bach32LocalTransform
      ? (cryptoCore.newAccount() as any).addressFromHexPublicKey(publicKey)
      : publicKey;

  const getPublicKey = (address = '') =>
    bach32LocalTransform && (isHash(address) || addressIsBach32(address))
      ? (cryptoCore.newAccount() as any).hexPublicKeyFromAddress(address)
      : address;

  return {
    getAddress,
    getPublicKey,
  };
}
