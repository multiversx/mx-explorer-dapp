import { Fragment } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { InfoTooltip, Loader, PageState } from 'components';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import {
  activeNetworkSelector,
  nodesIdentitiesSelector
} from 'redux/selectors';

import { IdentityRow, ResiliencyRow } from './components';

export const Identities = () => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { nodesIdentities, isFetched } = useSelector(nodesIdentitiesSelector);

  let coefficientShown = false;

  return (
    <div className='card identities'>
      <div className='card-header'>
        <NodesTabs />
      </div>

      {isFetched === undefined && <Loader />}
      {isFetched === false && (
        <PageState icon={faCogs} title='Unable to load validators' isError />
      )}
      {isFetched === true && (
        <div className='card-body'>
          <div className='table-wrapper animated-list'>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th className='th-rank'>#</th>
                  <th className='th-name'>Name</th>
                  <th>Stake</th>
                  <th className='th-stake-percent'>
                    Cumulative Stake
                    <InfoTooltip
                      title={
                        <>
                          <p>
                            The Cumulative Stake represents the total share of
                            staked {egldLabel} that this and all previous
                            validators add up to.
                          </p>
                          <p className='mb-0'>
                            To improve the decentralization of the network,
                            please consider staking your tokens with smaller,
                            independent validator operators who control a
                            smaller proportion of stake.
                          </p>
                        </>
                      }
                      tooltipClassName='tooltip-xl'
                    />
                  </th>
                  <th className='w-10 text-end'>Nodes</th>
                  <th className='th-details'>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {nodesIdentities.map((identity, i) => {
                  // TODO temporary - will be fetched from /stake
                  const isOverCoefficient =
                    new BigNumber(
                      identity?.overallStakePercent ?? 0
                    ).isGreaterThan(33.33) && !coefficientShown;
                  if (isOverCoefficient) {
                    coefficientShown = true;
                  }
                  return (
                    <Fragment key={i}>
                      {isOverCoefficient && <ResiliencyRow coefficient={i} />}
                      <IdentityRow key={i} identity={identity} />
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
