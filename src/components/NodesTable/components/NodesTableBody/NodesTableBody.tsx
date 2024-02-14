import { Fragment } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { PageState } from 'components';
import { faCogs } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { IdentityType, NodeType } from 'types';

import { AuctionListRow } from './Rows/AuctionListRow';
import { AuctionListTresholdRow } from './Rows/AuctionListTresholdRow';
import { QueueRow } from './Rows/QueueRow';
import { StandardRow } from './Rows/StandardRow';
import { StatisticsRow } from './Rows/StatisticsRow';

export interface NodesTableBodyUIType {
  nodes: NodeType[];
  statistics?: boolean;
  queue?: boolean;
  auctionList?: boolean;
  hasTresholdRow?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
  identities?: IdentityType[];
}

export const NodesTableBody = ({
  nodes,
  statistics,
  queue,
  auctionList,
  hasTresholdRow,
  type,
  status,
  identities
}: NodesTableBodyUIType) => {
  let colSpan = 8;
  if (queue) {
    colSpan = 5;
  }
  const {
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  const tresholdIndex = nodes.findLastIndex((node) => {
    const bNStake = new BigNumber(node.stake ?? 0).plus(node.auctionTopUp ?? 0);
    const bNMinimumAuctionStake = new BigNumber(
      minimumAuctionQualifiedStake ?? 0
    );

    return (
      bNStake.isGreaterThanOrEqualTo(bNMinimumAuctionStake) &&
      node.auctionQualified
    );
  });

  return (
    <tbody>
      {nodes.map((nodeData, index) => {
        if (statistics) {
          return <StatisticsRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (queue) {
          return <QueueRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (auctionList) {
          return (
            <Fragment key={nodeData.bls}>
              <AuctionListRow nodeData={nodeData} identities={identities} />
              {tresholdIndex && index === tresholdIndex && hasTresholdRow && (
                <AuctionListTresholdRow key={nodeData.bls} />
              )}
            </Fragment>
          );
        }
        return (
          <StandardRow
            nodeData={nodeData}
            index={index}
            type={type}
            status={status}
            key={nodeData.bls}
          />
        );
      })}
      {nodes.length === 0 && (
        <tr>
          <td colSpan={colSpan}>
            <PageState icon={faCogs} title='No Nodes' isError />
          </td>
        </tr>
      )}
    </tbody>
  );
};
