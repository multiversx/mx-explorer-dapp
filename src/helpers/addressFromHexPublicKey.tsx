import cryptoCore from 'lib/cryptoCore';

export default function addressFromHexPublicKey(publicKey: string) {
  return cryptoCore.newAccount().addressFromHexPublicKey(publicKey);
}
