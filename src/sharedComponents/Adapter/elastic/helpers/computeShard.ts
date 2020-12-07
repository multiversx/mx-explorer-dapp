const isAddressOfMetachain = (pubKey: any) => {
  // prettier-ignore
  let metachainPrefix = Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
  let pubKeyPrefix = pubKey.slice(0, metachainPrefix.length);

  if (pubKeyPrefix.equals(metachainPrefix)) {
    return true;
  }

  let zeroAddress = Buffer.alloc(32).fill(0);

  if (pubKey.equals(zeroAddress)) {
    return true;
  }

  return false;
};

const getShardOfAddress = (hexPubKey: any) => {
  let numShards = 3;
  let maskHigh = parseInt('11', 2);
  let maskLow = parseInt('01', 2);
  let pubKey = Buffer.from(hexPubKey, 'hex');
  let lastByteOfPubKey = pubKey[31];

  if (isAddressOfMetachain(pubKey)) {
    return 4294967295;
  }

  let shard = lastByteOfPubKey & maskHigh;

  if (shard > numShards - 1) {
    shard = lastByteOfPubKey & maskLow;
  }

  return shard;
};

export default getShardOfAddress;
