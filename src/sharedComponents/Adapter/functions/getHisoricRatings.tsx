import { AdapterFunctionType } from './index';

export default async function getHistoricRatings({
  baseUrl,
  timeout,
  key = '',
  provider,
}: AdapterFunctionType & { key: string }) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/ratingshistory/${key}`,
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
