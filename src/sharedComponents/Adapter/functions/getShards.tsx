import { AdapterFunctionType } from './index';

export default async function getShards({ provider, baseUrl, timeout }: AdapterFunctionType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/shards`,
      timeout,
    });

    return {
      data,
      success: data !== undefined,
    };
  } catch {
    return {
      success: false,
    };
  }
}
