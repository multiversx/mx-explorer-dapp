import { AdapterFunctionType } from './index';

export interface GetNodesType {
  search?: string;
  issues?: string;
  peerType?: string;
  nodeType?: string;
  shard?: string;
  status?: string;
  count?: boolean;
  size?: number;
  identity?: string;
  sort?: string;
  order?: string;
  pagination?: boolean;
}

export default async function getNodes({
  provider,
  baseUrl,
  timeout,
  peerType,
  issues,
  search,
  nodeType,
  shard,
  status,
  size,
  identity,
  sort,
  order,
  count = false,
  pagination = true,
}: AdapterFunctionType & GetNodesType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/nodes${count ? '/count' : ''}`,
      timeout,
      params: {
        ...(search !== undefined ? { search } : {}),
        ...(peerType !== undefined ? { peerType } : {}),
        ...(issues !== undefined ? { issues } : {}),
        ...(nodeType !== undefined ? { nodeType } : {}),
        ...(shard !== undefined ? { shard: parseInt(shard) } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(identity !== undefined ? { identity } : {}),
        ...(sort !== undefined ? { sort } : {}),
        ...(order !== undefined ? { order } : {}),
        ...(size !== undefined
          ? pagination
            ? { from: (size - 1) * 25, size: 25 }
            : { size }
          : {}),
      },
    });

    return {
      data,
      success: data !== undefined,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}
