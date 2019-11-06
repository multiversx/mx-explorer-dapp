import axios from 'axios';

type ElasticParamsType = {
  elasticUrl?: string;
  hash: string;
  timeout: number;
};

export async function isBlock({ elasticUrl, hash, timeout }: ElasticParamsType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/blocks/_doc/${hash}`, { timeout });
    return data.found;
  } catch (e) {
    return false;
  }
}

type NodeParamsType = {
  nodeUrl: string;
  hash: string;
  timeout: number;
};

export async function isAddress({ nodeUrl, hash, timeout }: NodeParamsType) {
  try {
    await axios.get(`${nodeUrl}/address/${hash}`, { timeout });
    return true;
  } catch (e) {
    return false;
  }
}

export async function isTransaction({ elasticUrl, hash, timeout }: ElasticParamsType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/transactions/_doc/${hash}`, { timeout });
    return data.found;
  } catch (e) {
    return false;
  }
}
