import { AdapterFunctionType } from './index';

export interface GetNodesType {
  search?: string;
  issues?: string;
  peerType?: string;
  nodeType?: string;
  shardId?: string;
  status?: string;
  count?: boolean;
  size?: number;
  identity?: string;
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
  shardId,
  status,
  size,
  identity,
  count = false,
  pagination = true,
}: AdapterFunctionType & GetNodesType) {
  console.log(pagination);

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
        ...(shardId !== undefined ? { shardId: parseInt(shardId) } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(identity !== undefined ? { identity } : {}),
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
