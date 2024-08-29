import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { FormatUSD, Overlay } from 'components';
import { faSquareInfo } from 'icons/solid';
import { TokenType, WithClassnameType } from 'types';

export interface LowLiquidityTooltipUIType extends WithClassnameType {
  token?: TokenType;
  showTotalLiquidity?: boolean;
}

export const LowLiquidityTooltip = ({
  token,
  showTotalLiquidity = true,
  className
}: LowLiquidityTooltipUIType) => {
  if (!token) {
    return null;
  }

  const { totalLiquidity, isLowLiquidity, lowLiquidityThresholdPercent } =
    token;

  if (!isLowLiquidity) {
    return null;
  }

  const displayTresholdPercent = new BigNumber(
    lowLiquidityThresholdPercent ?? 0.5
  ).toFormat();

  return (
    <Overlay
      title={
        <>
          Less than {displayTresholdPercent}% of total Token Supply captured in
          xExchange Liquidity Pools.
          {showTotalLiquidity && totalLiquidity && (
            <>
              (<FormatUSD value={totalLiquidity} usd={1} />)
            </>
          )}
        </>
      }
      className={classNames(className)}
      persistent
    >
      <FontAwesomeIcon icon={faSquareInfo} className='text-warning' />
    </Overlay>
  );
};
