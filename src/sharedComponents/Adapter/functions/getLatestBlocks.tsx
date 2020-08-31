import { AdapterFunctionType } from './index';

export default async function getLatestBlocks({
  provider,
  providerUrl,
  timeout,
}: AdapterFunctionType) {
  try {
    const params = {
      size: 25,
    };

    const { data } = await provider({
      providerUrl,
      url: `/blocks`,
      params,
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
