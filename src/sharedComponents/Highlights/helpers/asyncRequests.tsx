import axios from 'axios';

export async function getStats(elasticUrl: string) {
  try {
    const { data } = await axios.get(`${elasticUrl}/tps/_doc/meta`);

    if (!data.found) {
      //toastr.warning("Could not load statistics.", "Oops");
      return;
    }

    return data._source;
  } catch {
    return 0;
  }
}
