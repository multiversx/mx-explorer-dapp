import { AdapterFunctionType } from './index';

export default async function getLatestBlocks({ provider, baseUrl, timeout }: AdapterFunctionType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/blocks`,
      params: {
        size: 25,
        ...{
          fields: ['hash', 'nonce', 'shard', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
        },
      },
      timeout,
    });

    return Promise.resolve(data).then(function res(data) {
      return {
        data,
        blocksFetched: data !== undefined,
      };
    });
  } catch {
    return {
      data: [],
      blocksFetched: false,
    };
  }
}
