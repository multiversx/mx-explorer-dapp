import cryptoCore from 'lib/cryptoCore';

export default function hexPublicKeyFromAddress(publicKey = '') {
  return cryptoCore.newAccount().hexPublicKeyFromAddress(publicKey);
}
