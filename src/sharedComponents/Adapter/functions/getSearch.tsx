import axios from 'axios';
import { AdapterFunctionType } from './index';

export async function isBlock({
  provider,
  elasticUrl,
  hash,
  timeout,
}: AdapterFunctionType & { hash: string }) {
  try {
    const { data } = await provider({
      elasticUrl,
      url: `/blocks/${hash}`,
      timeout,
    });

    return data ? true : false;
  } catch (e) {
    return false;
  }
}

interface NodeParamsType {
  proxyUrl: string;
  hash: string;
  timeout: number;
}

export async function isAddress({ proxyUrl, hash, timeout }: NodeParamsType) {
  try {
    await axios.get(`${proxyUrl}/address/${hash}`, { timeout });
    return true;
  } catch (e) {
    return false;
  }
}

export async function isTransaction({
  provider,
  elasticUrl,
  proxyUrl,
  hash,
  timeout,
}: AdapterFunctionType & { proxyUrl: string; hash: string }) {
  try {
    const { data } = await provider({
      elasticUrl,
      url: `/transactions/${hash}`,
      timeout,
    });

    if (data === undefined) {
      throw new Error('not found');
    }

    return data ? true : false;
  } catch (e) {
    try {
      const {
        data: { code },
      } = await axios.get(`${proxyUrl}/transaction/${hash}`, { timeout });

      if (code === 'successful') {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
