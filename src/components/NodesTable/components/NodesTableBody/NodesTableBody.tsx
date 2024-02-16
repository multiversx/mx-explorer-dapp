import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { PageState } from 'components';
import { getExpandRowDetails } from 'helpers';
import { useGetSort } from 'hooks';
import { faCogs } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { NodeType, SortOrderEnum } from 'types';

import { AuctionListRow } from './Rows/AuctionListRow';
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
}

const findTresholdNode = (
  node: NodeType,
  minimumAuctionQualifiedStake?: string
) => {
  const bNStake = new BigNumber(node.stake ?? 0).plus(node.auctionTopUp ?? 0);
  const bNMinimumAuctionStake = new BigNumber(
    minimumAuctionQualifiedStake ?? 0
  );

  return (
    bNStake.isGreaterThanOrEqualTo(bNMinimumAuctionStake) &&
    node.auctionQualified
  );
};

export const NodesTableBody = ({
  nodes,
  statistics,
  queue,
  auctionList,
  hasTresholdRow,
  type,
  status
}: NodesTableBodyUIType) => {
  let colSpan = 8;
  if (queue) {
    colSpan = 5;
  }
  const {
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);
  const { sort, order } = useGetSort();
  const isSortDesc = sort === 'auctionPosition' && order === SortOrderEnum.desc;

  const tresholdIndex = isSortDesc
    ? nodes.findIndex((node) =>
        findTresholdNode(node, minimumAuctionQualifiedStake)
      )
    : nodes.findLastIndex((node) =>
        findTresholdNode(node, minimumAuctionQualifiedStake)
      );

  const expandRowDetails =
    auctionList && hasTresholdRow ? getExpandRowDetails(nodes) : undefined;

  return (
    <tbody>
      {nodes.map((nodeData, index) => {
        const showTresholdRow = Boolean(
          tresholdIndex && index === tresholdIndex && hasTresholdRow
        );

        if (statistics) {
          return <StatisticsRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (queue) {
          return <QueueRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (auctionList) {
          return (
            <AuctionListRow
              nodeData={nodeData}
              key={nodeData.bls}
              showTresholdRow={showTresholdRow}
              expandRowDetails={expandRowDetails}
            />
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
