import { isUtf8, addressIsBech32, bech32 } from 'helpers';

export default function decodeTopic(topic: string) {
  let decodedPart = '';
  const base64Buffer = Buffer.from(String(topic), 'base64');
  const base64Decoded = base64Buffer.toString();

  if (isUtf8(base64Decoded) && base64Decoded.length > 1) {
    decodedPart = base64Decoded;
  } else {
    const hexDecoded = base64Buffer.toString('hex').trim();
    if (isUtf8(hexDecoded) && hexDecoded.length > 1) {
      decodedPart = hexDecoded;
      try {
        const bech32Encoded = bech32.encode(hexDecoded);
        if (addressIsBech32(bech32Encoded)) {
          decodedPart = bech32Encoded;
        }
      } catch {}
    } else {
      decodedPart = base64Buffer.toString();
    }
  }

  return decodedPart;
}
