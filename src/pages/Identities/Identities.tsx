import { useEffect, useRef, useState } from 'react';

import { Loader, PageState } from 'components';
import { useAdapter } from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { IdentityType } from 'types';

import { IdentityRow } from './components/IdentityRow';

export const Identities = () => {
  const ref = useRef(null);
  const { getIdentities } = useAdapter();

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
        <PageState
          icon={faCogs}
          title='Unable to load validators'
          className='py-spacer my-auto'
          data-testid='errorScreen'
        />
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
                  <th className='th-stake-percent'>Cumulative stake</th>
                  <th className='w-10 text-end'>Nodes</th>
                  {/* <th className="w-10 text-end">Score</th> */}
                  <th className='th-details'>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {identities.map((identity, i) => (
                  <IdentityRow key={i} identity={identity} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
