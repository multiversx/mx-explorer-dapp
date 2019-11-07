import axios from 'axios';

type GetStatsType = {
  elasticUrl: string;
  timeout: number;
};

export async function getStats({ elasticUrl, timeout }: GetStatsType) {
  let data = {};
  try {
    const { data } = await axios.get(`${elasticUrl}/tps/_doc/meta`, { timeout });

    if (!data.found) {
      return {
        data,
        success: false,
      };
    }

    return {
      data: data._source,
      success: true,
    };
  } catch {
    return {
      data,
      success: false,
    };
  }
}
