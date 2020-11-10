import { AdapterFunctionType } from './index';

export interface GetRoundsType {
  validator: string;
  shardId: number;
}

export default async function getRounds({
  baseUrl,
  timeout,
  validator = '',
  shardId,
  provider,
}: AdapterFunctionType & GetRoundsType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/rounds`,
      params: {
        size: 100,
        from: 0,
        validator,
        shardId,
      },
      timeout,
    });

    return {
      data,
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
}
