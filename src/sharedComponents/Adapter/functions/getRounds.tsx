import { AdapterFunctionType } from './index';

export default async function getRounds({
  baseUrl,
  timeout,
  validator = '',
  provider,
}: AdapterFunctionType & { validator: string }) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/rounds`,
      params: {
        size: 100,
        from: 0,
        validator,
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
