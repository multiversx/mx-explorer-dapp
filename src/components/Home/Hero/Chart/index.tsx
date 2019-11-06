import React from 'react';
import moment from 'moment';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid } from 'recharts';
import { useGlobalState } from '../../../../context';
import { getLastTransactionsCount } from './helpers/asyncRequests';

type DataType = {
  value: number;
  time: number;
};

const Chart = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { elasticUrl, roundTime: activeRoundTime },
    timeout,
  } = useGlobalState();
  let initialValuesCount = 0;
  const initialValues: number[] = [];
  const [data, setData] = React.useState<DataType[]>([]);

  React.useEffect(() => {
    if (ref.current !== null) {
      let prePopulateCount = 20;
      let roundTime = activeRoundTime / 1000;
      let dataLag = 2 * roundTime;

      let date = new Date();
      let epoch = Math.floor(date.getTime() / 1000);
      const initialData: any = [];
      /* eslint-disable no-undef */
      for (let i = prePopulateCount + 1; i > 1; i--) {
        let start = epoch - dataLag - i * roundTime;
        let end = epoch - dataLag - i * roundTime + roundTime;

        getLastTransactionsCount({ elasticUrl, start, end, timeout }).then(({ count }) => {
          initialValuesCount++;
          initialValues[i] = Math.floor(count / roundTime);

          if (initialValuesCount === 20) {
            for (let j = 21; j > 1; j--) {
              let dataLag = 2 * roundTime * 1000;
              let myTime = new Date().getTime() - dataLag - j * roundTime + roundTime;
              initialData.push({
                value: initialValues[j],
                time: myTime,
              });
            }
            setData(initialData);
          }
        });
      }
    }
  }, [elasticUrl, timeout, activeRoundTime]);

  return (
    <ResponsiveContainer ref={ref}>
      <LineChart height={175} data={data}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,.1)" />
        <YAxis stroke="rgba(255,255,255,.2)" />
        <XAxis
          dataKey="time"
          tickFormatter={timeStr => moment(timeStr).format('HH:mm')}
          stroke="rgba(255,255,255,.2)"
        />
        <Line type="monotone" dataKey="value" stroke="rgba(255,255,255,.6)" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
