import { AdapterFunctionType } from './index';

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
}: AdapterFunctionType & {
  search?: string;
  issues?: string;
  peerType?: string;
  nodeType?: string;
  shard?: string;
  status?: string;
}) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/nodes`,
      timeout,
      params: {
        ...(search !== undefined ? { search } : {}),
        ...(peerType !== undefined ? { peerType } : {}),
        ...(issues !== undefined ? { issues } : {}),
        ...(nodeType !== undefined ? { nodeType } : {}),
        ...(shard !== undefined ? { shard } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    return {
      data,
      success: data.length > 0,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}
