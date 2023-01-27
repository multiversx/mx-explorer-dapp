import * as React from 'react';
import { faLeaf } from '@fortawesome/pro-solid-svg-icons/faLeaf';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';

import { CardItem, MultilayerPercentageBar, PageState } from 'components';

import {
  activeNetworkSelector,
  economicsSelector,
  globalStakeSelector
} from 'redux/selectors';

export const GlobalStakeCard = ({
  stakeFetched
}: {
  stakeFetched: boolean;
}) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { nodesVerions } = useSelector(globalStakeSelector);
  const { isFetched, baseApr, staked } = useSelector(economicsSelector);

  const displayBaseApr = isFetched
    ? `Up to ${new BigNumber(baseApr).times(100).toFormat(2)}%`
    : 'N/A';

  return stakeFetched === false ? (
    <div className='row'>
      <div className='col mb-spacer'>
        <div className='card py-4'>
          <PageState
            icon={faLock}
            title='Unable to load global stake'
            titleClassName='mt-0'
            className='page-state-sm'
            dataTestId='errorScreen'
          />
        </div>
      </div>
    </div>
  ) : (
    <div className='row global-stake-card'>
      <div className='col mb-spacer'>
        <div className='card d-flex flex-column flex-lg-row flex-wrap py-3 px-2 px-lg-4'>
          <div className='card-body d-flex flex-column flex-lg-row'>
            <div className='card-item-container w-100'>
              <CardItem className='n3 lg' title='Active Stake' icon={faLock}>
                <div className='d-flex flex-column w-100'>
                  <h5 className='m-0 pb-1'>
                    {isFetched ? (
                      <>
                        {new BigNumber(staked).toFormat(0)} {egldLabel}
                      </>
                    ) : (
                      '...'
                    )}
                  </h5>
                </div>
              </CardItem>

              <CardItem className='n3 lg' title='Staking APR' icon={faLeaf}>
                <div className='d-flex flex-column w-100'>
                  <h5 className='m-0 pb-1'>
                    {isFetched ? displayBaseApr : '...'}
                  </h5>
                </div>
              </CardItem>

              <CardItem
                className='n3 lg'
                title='Stake Weighted Node Version'
                customIcon={<MultiversXSymbol />}
              >
                <div className='d-flex flex-column flex-fill'>
                  {nodesVerions ? (
                    <MultilayerPercentageBar steps={nodesVerions} />
                  ) : (
                    'N/A'
                  )}
                </div>
              </CardItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
