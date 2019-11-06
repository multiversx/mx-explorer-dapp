type AddValueToChartType = {
  newValue: number;
  myTime: number;
  requestsCount: number;
  data: any;
};

export function addValueToChart({ newValue, myTime, requestsCount, data }: AddValueToChartType) {
  requestsCount++;

  if (myTime === 0) myTime = new Date().getTime();
  let label = roundMin(new Date(myTime).getHours()) + ':' + roundMin(new Date(myTime).getMinutes());
  if (requestsCount < 40) {
    label = label + ':' + roundMin(new Date(myTime).getSeconds());
  }

  if (requestsCount > 90) {
    data.labels.shift();
    data.datasets[0].data.shift();
  }

  let granularity = 30;
  if (requestsCount < 40) granularity = 10;

  if (requestsCount === 40) {
    data.labels[19] = '';
  } else if (requestsCount === 60) {
    data.labels[39] = '';
    data.labels[8] = '';
    data.labels[29] = data.labels[29].substring(0, 5);
  }

  if (requestsCount % granularity === 0) {
    data.labels.push(label);
  } else {
    data.labels.push('');
  }

  let rounded = Math.round(newValue);
  data.datasets[0].data.push(rounded);

  // re-render the chart
  //   update();
}

function roundMin(min: number) {
  if (min < 10) return '0' + min;
  else return min;
}
