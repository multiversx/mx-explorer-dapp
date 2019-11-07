export function addValueToChart(
  newValue: number,
  myTime: number,
  requestsCount: number,
  myChart: any
) {
  requestsCount++;

  if (myTime === 0) myTime = new Date().getTime();
  let label = roundMin(new Date(myTime).getHours()) + ':' + roundMin(new Date(myTime).getMinutes());
  if (requestsCount < 40) {
    label = label + ':' + roundMin(new Date(myTime).getSeconds());
  }

  if (requestsCount > 90) {
    myChart.data.labels.shift();
    myChart.data.datasets[0].data.shift();
  }

  let granularity = 30;
  if (requestsCount < 40) granularity = 10;

  if (requestsCount === 40) {
    myChart.data.labels[19] = '';
  } else if (requestsCount === 60) {
    myChart.data.labels[39] = '';
    myChart.data.labels[8] = '';
    myChart.data.labels[29] = myChart.data.labels[29] && myChart.data.labels[29].substring(0, 5);
  }

  if (requestsCount % granularity === 0) {
    myChart.data.labels.push(label);
  } else {
    myChart.data.labels.push('');
  }

  // remove empty elements
  myChart.data.labels = myChart.data.labels.filter(() => true);

  let rounded = Math.round(newValue);
  myChart.data.datasets[0].data.push(rounded);

  myChart.update();

  return requestsCount;
}

function roundMin(min: number) {
  if (min < 10) return '0' + min;
  else return min;
}
