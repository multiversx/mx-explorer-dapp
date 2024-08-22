import { useRef, useState } from 'react';
import BigNumber from 'bignumber.js';

import { MAX_RESULTS } from 'appConstants';
import { ReactComponent as CarretDown } from 'assets/img/carret-down.svg';
import {
  Loader,
  NetworkLink,
  Trim,
  PageState,
  NodesTable,
  SharedIdentity,
  FormatAmount,
  PercentageBar,
  Overlay,
  LockedStakeTooltip,
  FormatNumber
} from 'components';
import { formatPercentLabel, urlBuilder } from 'helpers';
import { useAdapter, useGetSort } from 'hooks';
import { faCogs } from 'icons/regular';
import { IdentityType, NodeType } from 'types';

import { SortIdentitesFieldEnum } from '../helpers';

export interface IdentityRowType {
  identity: IdentityType;
  index?: number;
}

export const IdentityRow = ({ identity, index }: IdentityRowType) => {
  const ref = useRef(null);
  const { getNodes, getNode } = useAdapter();
  const { sort } = useGetSort();
  const [collapsed, setCollapsed] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [identityNodes, setIdentityNodes] = useState<NodeType[]>([]);

  const expand = (identityRow: IdentityType) => () => {
    if (dataReady === undefined) {
      if (identityRow.identity) {
        getNodes({
          identity: identityRow.identity,
          size: MAX_RESULTS
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

  const currentValidatorsTotalPercent = new BigNumber(
    identity.validatorsPercent || 0
  ).plus(identity.overallValidatorsPercent || 0);

  const isStakeSorting = sort === SortIdentitesFieldEnum.locked;

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
        <td>{index ?? identity.rank}</td>
        <td>
          <div className='d-flex align-items-center'>
            <NetworkLink to={link}>
              <SharedIdentity.Avatar identity={identity} className='me-2' />
            </NetworkLink>
            {identity.name && identity.name.length > 70 ? (
              <NetworkLink to={link} className='trim-wrapper trim-size-xl'>
                <Trim text={identity.name} />
              </NetworkLink>
            ) : (
              <NetworkLink to={link} className='trim-wrapper trim-size-xl'>
                {identity.name ?? 'N/A'}
              </NetworkLink>
            )}
          </div>
        </td>

        <td>{new BigNumber(identity.validators).toFormat()}</td>
        <td>
          {identity.validatorsPercent ? (
            <FormatNumber
              value={identity.validatorsPercent}
              label='%'
              decimalOpacity={false}
              hideLessThanOne
            />
          ) : (
            'N/A'
          )}
        </td>
        <td>
          <div className='d-flex align-items-center'>
            {isStakeSorting ? (
              <>
                <PercentageBar
                  overallPercent={identity.overallStakePercent || 0}
                  overallPercentLabel={formatPercentLabel(
                    identity.overallStakePercent
                  )}
                  fillPercent={identity.stakePercent}
                  fillPercentLabel={formatPercentLabel(identity.stakePercent)}
                />
                <div className='ms-2'>
                  <FormatNumber
                    value={identity.stakePercent}
                    label='%'
                    maxDigits={2}
                    decimalOpacity={false}
                    hideLessThanOne
                  />
                </div>
              </>
            ) : (
              <>
                <PercentageBar
                  overallPercent={identity.overallValidatorsPercent || 0}
                  overallPercentLabel={formatPercentLabel(
                    identity.overallValidatorsPercent
                  )}
                  fillPercent={identity.validatorsPercent}
                  fillPercentLabel={formatPercentLabel(
                    identity.validatorsPercent
                  )}
                />
                <div className='ms-2'>
                  <FormatNumber
                    value={currentValidatorsTotalPercent}
                    label='%'
                    maxDigits={2}
                    decimalOpacity={false}
                    hideLessThanOne
                  />
                </div>
              </>
            )}
          </div>
        </td>
        <td>
          <Overlay
            title={
              <LockedStakeTooltip
                stake={identity.stake}
                topUp={identity.topUp}
              />
            }
            tooltipClassName='tooltip-text-start tooltip-lg'
            truncate
          >
            <FormatAmount value={identity.locked} showTooltip={false} />
          </Overlay>
        </td>
        <td>
          <CarretDown className='details-arrow' height='8' />
        </td>
      </tr>
      {showDetails && (
        <tr className={`identity-details-row ${collapsed ? 'collapsed' : ''}`}>
          <td colSpan={7} className='p-0'>
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
                  isError
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
