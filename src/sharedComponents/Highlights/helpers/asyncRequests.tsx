import axios from 'axios';
import toastr from 'toastr';

export async function getStats(elasticUrl: string) {
  let data = {};
  try {
    const { data } = await axios.get(`${elasticUrl}/tps/_doc/meta`);

    if (!data.found) {
      console.warn('here');

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
