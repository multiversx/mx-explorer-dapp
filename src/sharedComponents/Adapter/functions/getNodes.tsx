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

export default async function getNodes(asyncRequest: () => Promise<any>) {
  try {
    const { data } = await asyncRequest();

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
