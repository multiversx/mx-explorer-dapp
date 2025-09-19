import { Fragment, useMemo } from 'react';
import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector, useDispatch } from 'react-redux';

import { InfoTooltip, Loader, Overlay, PageState, Sort } from 'components';
import { processNodesIdentities } from 'helpers';
import { useFetchNodesIdentities, useGetSort } from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import {
  activeNetworkSelector,
  nodesIdentitiesSelector,
  stakeSelector,
  stakeExtraSelector
} from 'redux/selectors';
import { setStakeExtra } from 'redux/slices/stakeExtra';
import { SortOrderEnum } from 'types';

import { IdentityRow, ResiliencyRow } from './components';
import { sortIdentities, SortIdentitesFieldEnum } from './helpers';

export const Identities = () => {
  const dispatch = useDispatch();
  const { sort, order } = useGetSort();
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { isDataReady: isStakeFetched, unprocessed } =
    useSelector(stakeSelector);
  const { isNodesIdentityCountFetched, unprocessed: stakeExtraUnprocessed } =
    useSelector(stakeExtraSelector);
  const { nodesIdentities, isDataReady } = useSelector(nodesIdentitiesSelector);

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
    if (isDataReady && nodesIdentities.length > 0) {
      // avoid an extra call on identity details page, save existing data in state
      if (!isNodesIdentityCountFetched) {
        const totalValidators = nodesIdentities
          .map(({ validators }) => validators || 0)
          .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(0));

        dispatch(
          setStakeExtra({
            totalIdentityNodes: totalValidators.toFormat(0),
            unprocessed: {
              ...stakeExtraUnprocessed,
              totalIdentityNodes: totalValidators.toNumber()
            },
            isNodesIdentityCountFetched: true
          })
        );
      }
    }
  }, [sort, order, nodesIdentities, isDataReady]);

  const displayNodesIdentities = useMemo(() => {
    if (!isDataReady || !nodesIdentities) {
      return [];
    }

    const sortedIdentities = sortIdentities({
      field:
        (sort as SortIdentitesFieldEnum) ?? SortIdentitesFieldEnum.validators,
      order: order ?? SortOrderEnum.desc,
      sortArray: [...nodesIdentities]
    });

    const processedCumulativeStake = processNodesIdentities(sortedIdentities);

    return processedCumulativeStake;
  }, [sort, order, nodesIdentities, isDataReady]);

  return (
    <div className='card identities'>
      <div className='card-header'>
        <NodesTabs />
      </div>

      {isDataReady === undefined && <Loader />}
      {isDataReady === false && (
        <PageState icon={faCogs} title='Unable to load validators' isError />
      )}
      {isDataReady === true && (
        <div className='card-body'>
          <div className='table-wrapper animated-list'>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th className='th-rank'>#</th>
                  <th className='th-name'>
                    <Sort text='Name' id={SortIdentitesFieldEnum.name} />
                  </th>
                  <th className='w-10 text-center'>
                    <Sort
                      text='Nodes'
                      id={SortIdentitesFieldEnum.validators}
                      defaultOrder={SortOrderEnum.desc}
                      defaultActive
                    />
                  </th>
                  <th className='text-neutral-400 w-10 text-center'>
                    <Overlay title='Percent of Total Nodes'>% of Total</Overlay>
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
                  <th className='text-end'>
                    <Sort
                      text='Stake'
                      id={SortIdentitesFieldEnum.locked}
                      hasNegativeMargin={false}
                    />
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
                      {Boolean(
                        showResiliencyCoefficient && isOverCoefficient
                      ) && (
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
