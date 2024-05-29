import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { InfoTooltip, Loader, PageState, Sort } from 'components';
import { processNodesIdentities } from 'helpers';
import { useFetchNodesIdentities, useGetSort } from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import {
  activeNetworkSelector,
  nodesIdentitiesSelector,
  stakeSelector
} from 'redux/selectors';
import { IdentityType, SortOrderEnum } from 'types';

import { IdentityRow, ResiliencyRow } from './components';
import { sortIdentities, SortIdentitesFieldEnum } from './helpers';

export const Identities = () => {
  const { sort, order } = useGetSort();
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { isFetched: isStakeFetched, unprocessed } = useSelector(stakeSelector);
  const { nodesIdentities, isFetched } = useSelector(nodesIdentitiesSelector);

  const [displayNodesIdentities, setDisplayNodesIdentities] = useState<
    IdentityType[]
  >([]);

  useFetchNodesIdentities({
    sort: SortIdentitesFieldEnum.validators,
    order: SortOrderEnum.desc
  });

  let coefficientShown = false;
  const resiliencyCoefficient = unprocessed?.nakamotoCoefficient ?? 0;
  const isStakeSorting = sort === SortIdentitesFieldEnum.locked;
  const isValidatorsSorting =
    !(sort && order) ||
    (sort === SortIdentitesFieldEnum.validators &&
      order === SortOrderEnum.desc);
  const showResiliencyCoefficient =
    isStakeFetched && resiliencyCoefficient && isValidatorsSorting;

  useEffect(() => {
    if (isFetched && nodesIdentities.length > 0) {
      if (sort && order) {
        const sortedIdentities = sortIdentities({
          field: sort as SortIdentitesFieldEnum,
          order,
          sortArray: [...nodesIdentities]
        });
        const processedCumulativeStake =
          processNodesIdentities(sortedIdentities);
        setDisplayNodesIdentities(processedCumulativeStake);

        return;
      }

      setDisplayNodesIdentities(nodesIdentities);
    }
  }, [sort, order, nodesIdentities, isFetched]);

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
                  <th className='th-name'>
                    <Sort text='Name' id={SortIdentitesFieldEnum.name} />
                  </th>
                  <th>
                    <Sort text='Stake' id={SortIdentitesFieldEnum.locked} />
                  </th>
                  <th className='th-stake-percent'>
                    {isStakeSorting ? 'Cumulative Stake' : 'Cumulative Nodes'}
                    <InfoTooltip
                      title={
                        <>
                          <p className='mb-0'>
                            {isStakeSorting ? (
                              <>
                                The Cumulative Stake represents the total share
                                of staked {egldLabel} that this and all previous
                                validators add up to.
                              </>
                            ) : (
                              <>
                                The Cumulative Nodes represents the total share
                                of nodes that this and all previous validators
                                add up to.
                              </>
                            )}
                          </p>
                          <p className='mt-1 mb-0'>
                            To improve the decentralization of the network,
                            please consider staking your tokens with smaller,
                            independent validator operators who control fewer
                            nodes.
                          </p>
                        </>
                      }
                      tooltipClassName='tooltip-xl'
                    />
                  </th>
                  <th className='w-10 text-end'>
                    <Sort text='Nodes' id={SortIdentitesFieldEnum.validators} />
                  </th>
                  <th className='th-details'>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {displayNodesIdentities.map((identity, i) => {
                  const isOverCoefficient =
                    new BigNumber(i).isGreaterThanOrEqualTo(
                      resiliencyCoefficient
                    ) && !coefficientShown;
                  if (
                    new BigNumber(i).isGreaterThanOrEqualTo(
                      resiliencyCoefficient
                    )
                  ) {
                    coefficientShown = true;
                  }
                  return (
                    <Fragment key={i}>
                      {showResiliencyCoefficient && isOverCoefficient && (
                        <ResiliencyRow coefficient={resiliencyCoefficient} />
                      )}
                      <IdentityRow key={i} identity={identity} index={i + 1} />
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
