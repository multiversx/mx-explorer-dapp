import React from 'react';
import moment from 'moment';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid } from 'recharts';
import { useGlobalState } from '../../../../context';
import { getLastTransactionsCount } from './helpers/asyncRequests';
import { addValueToChart } from './helpers/chartHelpers';

type DataType = {
  value: number;
  time: number;
};

const Chart = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { elasticUrl, roundTime: activeRoundTime },
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

        getLastTransactionsCount({ elasticUrl, start, end }).then(({ count }) => {
          initialValuesCount++;
          initialValues[i] = Math.floor(count / roundTime);

          if (initialValuesCount === 20) {
            for (let i = 21; i > 1; i--) {
              let dataLag = 2 * roundTime * 1000;
              let myTime = new Date().getTime() - dataLag - i * roundTime + roundTime;
              initialData.push({
                value: initialValues[i],
                time: myTime,
              });
            }
            setData(initialData);
          }
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
