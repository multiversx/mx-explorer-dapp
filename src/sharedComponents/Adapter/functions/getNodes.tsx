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
  count = false,
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
        ...(shard !== undefined ? { shard } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(identity !== undefined ? { identity } : {}),
        ...(size !== undefined ? { from: (size - 1) * 50, size: 50 } : {}),
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
