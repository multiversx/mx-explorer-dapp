import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalDispatch, useGlobalState } from 'context';
import { IdentityType } from 'context/state';
import { adapter, Loader } from 'sharedComponents';
import NodesLayout from 'sharedComponents/NodesLayout';
import IdentityRow from './IdentityRow';
import { stakePerValidator } from 'appConfig';

const Identities = () => {
  const ref = React.useRef(null);
  const { getIdentities } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const dispatch = useGlobalDispatch();
  const { identities } = useGlobalState();

  const fetchIdentities = () => {
    getIdentities().then(({ data, success }) => {
      let totalNodes = 0;
      const identities: IdentityType[] = [];
      data.forEach((identity) => {
        const stake = identity.validators * stakePerValidator;
        identities.push({
          ...identity,
          stake,
          overallStakePercent: 0,
          stakePercent: 0,
        });
        totalNodes = totalNodes + identity.validators;
      });
      dispatch({
        type: 'setIdentities',
        identities,
        blockchainTotalStake: totalNodes * stakePerValidator,
      });
      setDataReady(success);
    });
  };

  React.useEffect(fetchIdentities, []);

  return (
    <NodesLayout>
      <div ref={ref}>
        {dataReady === undefined && <Loader />}
        {dataReady === true && (
          <div className="branded-validators card-body card-list">
            <div className="table-responsive" style={{ minHeight: '50px' }}>
              <table className="table table-hover">
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
        {dataReady === false && (
          <div className="card-body" data-testid="errorScreen">
            <div className="empty">
              <FontAwesomeIcon icon={faCogs} className="empty-icon" />
              <span className="h4 empty-heading">Unable to load validators</span>
            </div>
          </div>
        )}
      </div>
    </NodesLayout>
  );
};

export default Identities;
