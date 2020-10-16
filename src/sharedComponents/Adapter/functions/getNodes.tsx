import { AdapterFunctionType } from './index';

export default async function getNodes({
  provider,
  baseUrl,
  timeout,
  searchValue,
  peerType,
  issues,
}: AdapterFunctionType & { searchValue?: string; peerType?: string; issues?: string }) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/nodes`,
      timeout,
      params: {
        ...(searchValue !== undefined ? { searchValue } : {}),
        ...(peerType !== undefined ? { peerType } : {}),
        ...(issues !== undefined ? { issues } : {}),
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
