import { Dot } from 'recharts';

export const CustomDot = (props: any) => {
  const { payload } = props;

  if (payload?.isBinnedData) {
    return <></>;
  }

  return <Dot {...props} />;
};
