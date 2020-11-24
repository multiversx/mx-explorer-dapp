import { AdapterFunctionType } from './index';

export default async function getIdentity({
  provider,
  baseUrl,
  timeout,
  identity,
}: AdapterFunctionType & { identity: string }) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/identities/${identity}`,
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
