import moment from 'moment';

export const StartEndTick = (props: any) => {
  const extractables = ['tickFormatter', 'verticalAnchor', 'visibleTicksCount'];

  const args = Object.keys(props).reduce(
    (total, key) =>
      extractables.includes(key) ? total : { ...total, [key]: props[key] },
    { x: 30, index: 0, payload: { value: 0 } }
  );

  const isFirst = props?.payload?.index === 0;

  if (args.index === 0 || args.index + 1 === props.visibleTicksCount) {
    return (
      <g className='recharts-layer recharts-cartesian-axis-tick'>
        <text {...args}>
          <tspan x={args.x + (isFirst ? 20 : 10)} dy='0.71em'>
            {moment
              .unix(args.payload.value)
              .utc()
              .format(props?.dateformat ?? 'D MMM YYYY')}
          </tspan>
        </text>
      </g>
    );
  }

  return null;
};
