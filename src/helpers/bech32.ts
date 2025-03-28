import { bech32 } from 'bech32';
import { DEFAULT_HRP } from 'appConstants';

const encode = (publicKey: any, hrp = DEFAULT_HRP) => {
  const words = bech32.toWords(Buffer.from(publicKey, 'hex'));
  return bech32.encode(hrp, words);
};

const decode = (address: any) => {
  const decoded = bech32.decode(address, 256);
  return Buffer.from(bech32.fromWords(decoded.words)).toString('hex');
};

export { encode, decode };
