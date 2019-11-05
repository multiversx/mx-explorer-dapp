export default function addressIsHash(dstAddress: string) {
  return !(!dstAddress || dstAddress.length !== 64 || /^[0-9A-Fa-f]+$/i.test(dstAddress) !== true);
}
