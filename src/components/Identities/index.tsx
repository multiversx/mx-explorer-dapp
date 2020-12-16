import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { useGlobalDispatch, useGlobalState } from 'context';
import { IdentityType } from 'context/state';
import { adapter, Loader, PageState } from 'sharedComponents';
import NodesLayout from 'sharedComponents/NodesLayout';
import IdentityRow from './IdentityRow';
import NodeTabs from 'sharedComponents/NodesLayout/NodeTabs';

const Identities = () => {
  const ref = React.useRef(null);
  const { getIdentities } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const dispatch = useGlobalDispatch();
  const { identities } = useGlobalState();

  const fetchIdentities = () => {
    getIdentities().then(({ data, success }) => {
      const identitiesList: IdentityType[] = [];
      let blockchainTotalStake = 0;
      let overallStakePercent = 0;

      if (success) {
        data.forEach((identity: IdentityType) => {
          if (!identity.stake || !identity.validators) {
            return;
          }

          identitiesList.push({ ...identity, overallStakePercent });
          blockchainTotalStake = blockchainTotalStake + identity.stake;
          overallStakePercent = overallStakePercent + identity.stakePercent;
        });
        dispatch({
          type: 'setIdentities',
          identities: identitiesList,
          blockchainTotalStake,
        });
      }

      setDataReady(success);
    });
  };

  React.useEffect(fetchIdentities, []);

  return (
    <div className="d-flex flex-column flex-fill" ref={ref}>
      <NodesLayout>
        <div className="card identities">
          <div className="card-header">
            <NodeTabs />
          </div>

          {dataReady === undefined && <Loader />}
          {dataReady === false && (
            <PageState
              icon={faCogs}
              title="Unable to load validators"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          )}
          {dataReady === true && (
            <div className="card-body p-0">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="th-rank">#</th>
                      <th className="th-name">Validator Name</th>
                      <th>Stake</th>
                      <th className="th-stake-percent">Cumulative stake</th>
                      <th className="w-10 text-right">Nodes</th>
                      <th className="w-10 text-right">Score</th>
                      <th className="th-details">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {identities.map((identity, i) => (
                      <IdentityRow key={i} rank={i + 1} identity={identity} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </NodesLayout>
    </div>
  );
};

export default Identities;
