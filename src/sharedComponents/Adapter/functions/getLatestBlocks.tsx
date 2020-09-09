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

    const blocks = data.map((block: any) => ({ hash: block.id, ...block }));

    return {
      data: blocks,
      blocksFetched: data.length > 0,
    };
  } catch {
    return {
      data: [],
      blocksFetched: false,
    };
  }
}
