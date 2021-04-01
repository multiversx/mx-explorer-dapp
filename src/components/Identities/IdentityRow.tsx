import React from 'react';
import { IdentityType, NodeType } from 'context/state';
import carretDown from 'assets/images/carret-down.svg';
import {
  Loader,
  NetworkLink,
  Trim,
  adapter,
  PageState,
  NodesTable,
  SharedIdentity,
  Denominate,
} from 'sharedComponents';
import PercentegeBar from './PercentegeBar';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { urlBuilder } from 'helpers';

export interface IdentityRowType {
  identity: IdentityType;
}

const IdentityRow = ({ identity }: IdentityRowType) => {
  const ref = React.useRef(null);
  const [collapsed, setCollapsed] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [identityNodes, setIdentityNodes] = React.useState<NodeType[]>([]);
  const { getNodes, getNode } = adapter();

  const expand = (identityRow: IdentityType) => () => {
    if (dataReady === undefined) {
      if (identityRow.identity) {
        getNodes({
          identity: identityRow.identity,
          size: 1500,
          pagination: false,
        }).then((nodes) => {
          if (ref.current !== null) {
            setDataReady(nodes.success);
            setIdentityNodes(nodes.data);
          }
        });
      } else {
        getNode(identityRow.name).then((node) => {
          if (ref.current !== null) {
            setDataReady(node.success);
            setIdentityNodes([node.data]);
          }
        });
      }
    }
    setShowDetails(true);
    setCollapsed(!collapsed);
  };

  const link = identity.identity
    ? urlBuilder.identityDetails(identity.identity)
    : urlBuilder.nodeDetails(identity.name);

  return (
    <>
      <tr
        onClick={expand(identity)}
        className={`identity-row ${collapsed ? 'collapsed' : ''}`}
        ref={ref}
      >
        <td>{identity.rank}</td>
        <td>
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <NetworkLink to={link}>
                <SharedIdentity.Avatar identity={identity} />
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
          <Denominate value={identity.locked} />
        </td>
        <td className="stake-bar-col">
          <div className="d-flex align-items-center">
            <div className="bar">
              <PercentegeBar
                overallPercent={identity.overallStakePercent || 0}
                fillPercent={identity.stakePercent}
                fillPercentLabel={Math.round(identity.stakePercent) + '%'}
              />
            </div>
            <div className="ml-3">
              {Math.round(identity.stakePercent) > 0 ? Math.round(identity.stakePercent) : '< 1'}%
            </div>
          </div>
        </td>
        <td className="text-right">{identity.validators.toLocaleString('en')}</td>
        {/* <td className="text-right">{Math.round(identity.score).toLocaleString('en')}</td> */}
        <td className="text-right">
          <img src={carretDown} className="details-arrow" alt="details-arrow" height="8" />
        </td>
      </tr>
      {showDetails && (
        <tr className={`identity-details-row ${collapsed ? 'collapsed' : ''}`}>
          <td colSpan={6} className="p-0">
            <div className="content">
              {dataReady === undefined && (
                <div className="py-4">
                  <Loader small={true} noText={true} />
                </div>
              )}
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
