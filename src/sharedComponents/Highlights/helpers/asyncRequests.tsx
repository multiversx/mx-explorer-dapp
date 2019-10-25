export async function getStats(elasticUrl: string) {
  try {
    const response = await fetch(`${elasticUrl}/tps/_doc/meta`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data = await response.json();

    if (!data.found) {
      //toastr.warning("Could not load statistics.", "Oops");
      return;
    }

    return data._source;
  } catch {
    return 0;
  }
}
