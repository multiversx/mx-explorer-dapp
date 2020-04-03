import axios from 'axios';
import { initialState } from '../index';

interface GetMiniBlocksType {
  elasticUrl: string;
  timeout: number;
  blockId?: string;
}

export async function getMiniBlock({ elasticUrl, timeout, blockId = '' }: GetMiniBlocksType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/miniblocks/_doc/${blockId}`, { timeout });
    const miniBlock = { hash: data._id, ...data._source };

    return {
      miniBlock,
      blockFetched: true,
    };
  } catch {
    return { ...initialState, blockFetched: false };
  }
}
