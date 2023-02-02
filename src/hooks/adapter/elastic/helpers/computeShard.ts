export const isAddressOfMetachain = (pubKey: any) => {
  // prettier-ignore
  const metachainPrefix = Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
  const pubKeyPrefix = pubKey.slice(0, metachainPrefix.length);

  if (pubKeyPrefix.equals(metachainPrefix)) {
    return true;
  }

  const zeroAddress = Buffer.alloc(32).fill(0);

  if (pubKey.equals(zeroAddress)) {
    return true;
  }

  return false;
};

export const getShardOfAddress = (hexPubKey: any) => {
  const numShards = 3;
  const maskHigh = parseInt('11', 2);
  const maskLow = parseInt('01', 2);
  const pubKey = Buffer.from(hexPubKey, 'hex');
  const lastByteOfPubKey = pubKey[31];

  if (isAddressOfMetachain(pubKey)) {
    return 4294967295;
  }

  let shard = lastByteOfPubKey & maskHigh;

  if (shard > numShards - 1) {
    shard = lastByteOfPubKey & maskLow;
  }

  return shard;
};
