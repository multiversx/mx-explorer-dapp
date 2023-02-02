import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';

import { ReactComponent as CarretDown } from 'assets/img/carret-down.svg';
import {
  Loader,
  NetworkLink,
  Trim,
  PageState,
  NodesTable,
  SharedIdentity,
  Denominate,
  PercentageBar
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { IdentityType, NodeType } from 'types';

export interface IdentityRowType {
  identity: IdentityType;
}

export const IdentityRow = ({ identity }: IdentityRowType) => {
  const ref = React.useRef(null);
  const [collapsed, setCollapsed] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [identityNodes, setIdentityNodes] = React.useState<NodeType[]>([]);
  const { getNodes, getNode } = useAdapter();

  const expand = (identityRow: IdentityType) => () => {
    if (dataReady === undefined) {
      if (identityRow.identity) {
        getNodes({
          identity: identityRow.identity,
          size: 1500,
          pagination: false
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

  const stakePercentLabel =
    Math.round(identity.stakePercent) > 0
      ? `${Math.round(identity.stakePercent)}%`
      : '< 1 %';

  return (
    <>
      <tr
        onClick={expand(identity)}
        className={`identity-row ${collapsed ? 'collapsed' : ''}`}
        ref={ref}
      >
        <td>{identity.rank}</td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='me-3'>
              <NetworkLink to={link}>
                <SharedIdentity.Avatar identity={identity} />
              </NetworkLink>
            </div>
            {identity.name && identity.name.length > 70 ? (
              <NetworkLink to={link} className='trim-wrapper'>
                <Trim text={identity.name} />
              </NetworkLink>
            ) : (
              <NetworkLink to={link}>
                {identity.name ? identity.name : 'N/A'}
              </NetworkLink>
            )}
          </div>
        </td>

        <td>
          <Denominate value={identity.locked} />
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <PercentageBar
              overallPercent={identity.overallStakePercent || 0}
              fillPercent={identity.stakePercent}
              fillPercentLabel={stakePercentLabel}
            />

            <div className='ms-3'>{stakePercentLabel}</div>
          </div>
        </td>
        <td className='text-end'>{identity.validators.toLocaleString('en')}</td>
        {/* <td className="text-end">{Math.round(identity.score).toLocaleString('en')}</td> */}
        <td className='text-end'>
          <CarretDown className='details-arrow' height='8' />
        </td>
      </tr>
      {showDetails && (
        <tr className={`identity-details-row ${collapsed ? 'collapsed' : ''}`}>
          <td colSpan={6} className='p-0'>
            <div className='content'>
              {dataReady === undefined && (
                <div className='py-4'>
                  <Loader small={true} noText={true} />
                </div>
              )}
              {dataReady === false && (
                <PageState
                  icon={faCogs}
                  title='Unable to load validators'
                  className='py-spacer my-auto'
                  dataTestId='errorScreen'
                />
              )}
              {dataReady === true && (
                <div className='nodes-table-wrapper py-2 px-4'>
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
