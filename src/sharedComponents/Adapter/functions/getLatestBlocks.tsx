import { AdapterFunctionType } from './index';

export default async function getLatestBlocks({ provider, baseUrl, timeout }: AdapterFunctionType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/blocks`,
      params: {
        size: 25,
      },
      timeout,
    });

    return {
      data,
      blocksFetched: true,
    };
  } catch {
    return {
      data: [],
      blocksFetched: false,
    };
  }
}
