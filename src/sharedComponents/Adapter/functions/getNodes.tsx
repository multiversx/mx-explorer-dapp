import { AdapterFunctionType } from './index';

export default async function getNodes({ provider, baseUrl, timeout }: AdapterFunctionType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/nodes`,
      timeout,
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
