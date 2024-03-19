import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Overlay } from 'components';
import { faInfoCircle } from 'icons/regular';

export const LowLiquidityTooltip = () => {
  return (
    <Overlay
      title='Less than 1% of total Token Supply captured in Liquidity Pools'
      className='cursor-context ms-2'
    >
      <FontAwesomeIcon icon={faInfoCircle} className='text-primary' />
    </Overlay>
  );
};
