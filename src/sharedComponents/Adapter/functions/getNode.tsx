import { AdapterFunctionType } from './index';

export default async function getNode({
  baseUrl,
  timeout,
  key = '',
  provider,
}: AdapterFunctionType & { key: string }) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/nodes/${key}`,
      timeout,
    });

    return {
      data,
      success: true,
    };
  } catch {
    return { success: false };
  }
}
