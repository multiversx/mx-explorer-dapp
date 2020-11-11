import { AdapterFunctionType } from './index';

export default async function getLatestBlocks({ provider, baseUrl, timeout }: AdapterFunctionType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/blocks`,
      params: {
        size: 25,
        ...{
          fields: ['hash', 'nonce', 'shardId', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
        },
      },
      timeout,
    });

    return {
      data,
      blocksFetched: data !== undefined,
    };
  } catch {
    return {
      data: [],
      blocksFetched: false,
    };
  }
}
