import React from 'react';
import BigNumber from 'bignumber.js';
import { useGlobalState } from 'context';
import { ValidatorType } from 'context/validators';
import { IdentityType } from 'context/state';
import carretDown from 'assets/images/carret-down.svg';
import { Loader, NetworkLink, Trim, adapter, PageState, NodesTable } from 'sharedComponents';
import PercentegeBar from 'components/Validators/ValidatorDetails/PercentegeBar';
import { validatorsRoutes } from 'routes';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';

export interface IdentityRowType {
  identity: IdentityType;
  rank: number;
}

export const stake = ({ stake }: IdentityType) => {
  return parseFloat(new BigNumber(stake).dividedBy(1000).valueOf()).toLocaleString('en');
};

export const cumulativeStakePercent = (identity: IdentityType, blockchainTotalStake: number) => {
  const stakePercent = (identity.stake / blockchainTotalStake) * 100;
  return `${Math.round(stakePercent) > 0 ? Math.round(stakePercent) : '< 1'}%`;
};

const IdentityRow = ({ identity, rank }: IdentityRowType) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [identityNodes, setIdentityNodes] = React.useState<ValidatorType[]>([]);
  const { blockchainTotalStake } = useGlobalState();
  const { getNodes, getNode } = adapter();

  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const expand = (node: IdentityType) => () => {
    if (dataReady === undefined) {
      if (node.identity) {
        getNodes({ identity: node.identity }).then((nodes) => {
          setDataReady(nodes.success);
          setIdentityNodes(nodes.data);
        });
      } else {
        getNode(node.name).then((node) => {
          setDataReady(node.success);
          setIdentityNodes([node.data]);
        });
      }
    }
    setShowDetails(true);
    setCollapsed(!collapsed);
  };

  const link = identity.identity ? `validators/${identity.identity}` : `nodes/${identity.name}`;

  return (
    <>
      <tr onClick={expand(identity)} className={`identity-row ${collapsed ? 'collapsed' : ''}`}>
        <td>{rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <NetworkLink to={link}>
                {}
                <img
                  className={`avatar ${!identity.avatar ? 'gray' : ''}`}
                  src={
                    identity.avatar
                      ? identity.avatar
                      : require('../../assets/images/default-avatar.svg')
                  }
                  alt={identity.name}
                  height="42"
                />
              </NetworkLink>
            </div>
            {identity.name && identity.name.length > 70 ? (
              <NetworkLink to={link} className="trim-wrapper">
                <Trim text={identity.name} />
              </NetworkLink>
            ) : (
              <NetworkLink to={link}>{identity.name ? identity.name : 'N/A'}</NetworkLink>
            )}
          </div>
        </td>

        <td>
          {stake(identity)} {erdLabel}
        </td>
        <td className="stake-bar-col">
          <div className="d-flex align-items-center">
            <div className="flex-fill">
              <PercentegeBar
                totalUpTimeLabel={Math.round(identity.overallStakePercent) + '%'}
                totalUpTimePercentege={identity.overallStakePercent}
                totalDownTimeLabel={Math.round(identity.stakePercent) + '%'}
                totalDownTimePercentege={identity.stakePercent}
              />
            </div>
            <div className="ml-3">{cumulativeStakePercent(identity, blockchainTotalStake)}</div>
          </div>
        </td>
        <td className="text-right">{identity.validators}</td>
        <td className="text-right">{Math.round(identity.score).toLocaleString()}</td>
        <td className="text-right">
          <img src={carretDown} className="details-arrow" alt="details-arrow" height="8" />
        </td>
      </tr>
      {showDetails && (
        <tr className={`identity-details-row ${collapsed ? 'collapsed' : ''}`}>
          <td colSpan={7} className="p-0">
            <div className="content">
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
                <div className="nodes-table-wrapper py-2 px-4">
                  <NodesTable hideFilters={true}>
                    <NodesTable.Body nodes={identityNodes} />
                  </NodesTable>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default IdentityRow;
