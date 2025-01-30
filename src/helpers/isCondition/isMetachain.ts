import { METACHAIN_SHARD_ID } from 'appConstants';

export const isMetachain = (value?: string | number) => {
  return (
    METACHAIN_SHARD_ID.toString() === String(value) ||
    String(value).toLowerCase() === 'metachain'
  );
};
