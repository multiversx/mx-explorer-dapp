import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { IdentityType } from 'context/state';
import { adapter, Loader, PageState } from 'sharedComponents';
import IdentityRow from './IdentityRow';
import NodesTabs from 'components/Nodes/NodesLayout/NodesTabs';

const Identities = () => {
  const ref = React.useRef(null);
  const { getIdentities } = adapter();

  const [identities, setIdentities] = React.useState<IdentityType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchIdentities, []);

  return (
    <div className="card identities" ref={ref}>
      <div className="card-header">
        <NodesTabs />
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
                  <th className="th-name">Name</th>
                  <th>Stake</th>
                  <th className="th-stake-percent">Cumulative stake</th>
                  <th className="w-10 text-right">Nodes</th>
                  {/* <th className="w-10 text-right">Score</th> */}
                  <th className="th-details">&nbsp;</th>
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

export default Identities;
