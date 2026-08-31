import { useSelector } from 'react-redux';

import { refreshSelector } from 'redux/selectors';
import { WithClassnameType } from 'types/withClassname.types';

export const PulsatingLed = ({ className }: WithClassnameType) => {
  const { timestamp } = useSelector(refreshSelector);

  return (
    <div className={`pulsating-led ${className ?? ''}`}>
      <div key={timestamp} className='pulse animation'></div>
      <div className='circle'></div>
    </div>
  );
};
