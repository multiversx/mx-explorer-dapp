import { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { InfoTooltip, Loader, PageState } from 'components';
import { useAdapter } from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { activeNetworkSelector, stakeSelector } from 'redux/selectors';
import { IdentityType } from 'types';

import { IdentityRow, ResiliencyRow } from './components';

export const Identities = () => {
  const ref = useRef(null);
  const { getIdentities } = useAdapter();
  const { egldLabel } = useSelector(activeNetworkSelector);
  const {
    unprocessed: { nakamotoCoefficient }
  } = useSelector(stakeSelector);

  const [identities, setIdentities] = useState<IdentityType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>(undefined);

  const fetchIdentities = () => {
    getIdentities().then(({ data, success }) => {
      const identitiesList: IdentityType[] = [];
      let overallStakePercent = 0;

      if (success) {
        data.forEach((identity: IdentityType) => {
          if (!identity.stake || !identity.validators) {
            return;
          }
          identitiesList.push({ ...identity, overallStakePercent });
          overallStakePercent = overallStakePercent + identity.stakePercent;
        });
        setIdentities(identitiesList);
      }

      setDataReady(success);
    });
  };

  useEffect(fetchIdentities, []);

  return (
    <div className='card identities' ref={ref}>
      <div className='card-header'>
        <NodesTabs />
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load validators' isError />
      )}
      {dataReady === true && (
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
                {identities.map((identity, i) => (
                  <Fragment key={i}>
                    {nakamotoCoefficient && i === nakamotoCoefficient && (
                      <ResiliencyRow coefficient={nakamotoCoefficient} />
                    )}
                    <IdentityRow key={i} identity={identity} />
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
