import { getColors } from 'helpers';

export const getPrimaryColor = () => {
  const [primary] = getColors(['primary']);

  return primary;
};
