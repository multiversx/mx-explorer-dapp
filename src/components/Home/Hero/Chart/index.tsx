import React from 'react';
import moment from 'moment';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid } from 'recharts';
import { useGlobalState } from '../../../../context';
import { getLastTransactionsCount } from './helpers/asyncRequests';

const data = [
  { value: 71, time: 1573029588041 },
  { value: 58, time: 1573029588047 },
  { value: 78, time: 1573029588053 },
  { value: 97, time: 1573029588059 },
  { value: 72, time: 1573029588065 },
  { value: 74, time: 1573029588071 },
  { value: 69, time: 1573029588077 },
  { value: 68, time: 1573029588083 },
  { value: 97, time: 1573029588089 },
  { value: 39, time: 1573029588095 },
  { value: 95, time: 1573029588101 },
  { value: 82, time: 1573029588107 },
  { value: 36, time: 1573029588113 },
  { value: 67, time: 1573029588119 },
  { value: 112, time: 1573029588125 },
  { value: 61, time: 1573029588131 },
  { value: 57, time: 1573029588137 },
  { value: 92, time: 1573029588143 },
  { value: 76, time: 1573029588149 },
  { value: 146, time: 1573029588155 },
];

const Chart = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { elasticUrl, roundTime: activeRoundTime },
  } = useGlobalState();
  let initialValuesCount = 0;
  const initialValues: number[] = [];

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

        getLastTransactionsCount({ elasticUrl, start, end }).then(({ count }) => {
          initialValuesCount++;
          initialValues[i] = Math.floor(count / roundTime);

          console.warn(count);

          if (initialValuesCount === 20) {
            for (let i = 21; i > 1; i--) {
              let dataLag = 2 * roundTime * 1000;
              let myTime = new Date().getTime() - dataLag - i * roundTime + roundTime;
              initialData.push({
                value: initialValues[i],
                time: myTime,
              });
            }
          }
          console.warn(11, initialData);
        });
      }
    }
  }, [elasticUrl]);

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
