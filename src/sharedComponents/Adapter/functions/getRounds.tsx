import { AdapterFunctionType } from './index';

export default async function getRounds({
  baseUrl,
  timeout,
  key = '',
  provider,
}: AdapterFunctionType & { key: string }) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/rounds/${key}`,
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
