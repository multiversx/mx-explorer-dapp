import axios from 'axios';

interface GetStatsType {
  elasticUrl: string;
  timeout: number;
}

export async function getStats({ elasticUrl, timeout }: GetStatsType) {
  const data = {};
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
