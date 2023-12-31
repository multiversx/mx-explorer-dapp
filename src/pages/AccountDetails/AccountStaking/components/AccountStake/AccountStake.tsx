import BigNumber from 'bignumber.js';

import { ReactComponent as MultiversXSymbol } from 'assets/img/multiversx-legacy-delegation.svg';
import { Denominate } from 'components';
import { StakeType } from 'types';

import { DetailsBlock } from '../DetailsBlock';

export const AccountStake = ({ stake }: { stake: StakeType }) => {
  const { totalStaked, unstakedTokens } = stake;

  const bNtotalUnstaked = unstakedTokens
    ? unstakedTokens
        .map(({ amount }) => amount)
        .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber('0'))
    : null;

  return (
    <div className='delegation-row d-flex flex-wrap align-items-center justify-content-between p-3 px-md-4'>
      <div className='provider-details'>
        <div className='d-flex flex-row align-items-center'>
          <div className='multiversx-icon provider-image has-avatar rounded-circle d-flex me-3'>
            <MultiversXSymbol />
          </div>
          <div className='d-flex flex-column w-100'>
            <div className='provider-title font-primary-medium d-flex align-items-center'>
              Staked Validator Nodes
            </div>
          </div>
        </div>
      </div>

      {totalStaked && totalStaked !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(totalStaked).toString(10)} />
          </strong>
          <small>Amount Staked</small>
        </DetailsBlock>
      )}

      {bNtotalUnstaked && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(bNtotalUnstaked).toString(10)} />
          </strong>
          <small>Unstaked</small>
        </DetailsBlock>
      )}
    </div>
  );
};
