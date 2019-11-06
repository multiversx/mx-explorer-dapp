import axios from 'axios';
import toastr from 'toastr';

type GetStatsType = {
  elasticUrl: string;
  timeout: number;
};

export async function getStats({ elasticUrl, timeout }: GetStatsType) {
  let data = {};
  try {
    const { data } = await axios.get(`${elasticUrl}/tps/_doc/meta`, { timeout });

    if (!data.found) {
      toastr.warning('Could not load statistics.', 'Oops');
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
    toastr.warning('Could not load statistics.', 'Oops');
    return {
      data,
      success: false,
    };
  }
}
