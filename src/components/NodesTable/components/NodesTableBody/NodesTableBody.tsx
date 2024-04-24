import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { PageState } from 'components';
import { useGetNodeFilters, useGetSearch, useGetSort } from 'hooks';
import { faCogs } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { NodeType, SortOrderEnum } from 'types';

import { AuctionRow } from './Rows/AuctionRow';
import { QueueRow } from './Rows/QueueRow';
import { StandardRow } from './Rows/StandardRow';
import { StatisticsRow } from './Rows/StatisticsRow';

export interface NodesTableBodyUIType {
  nodes: NodeType[];
  statistics?: boolean;
  queue?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
  auctionList?: boolean;
  showPosition?: boolean;
}

const findThresholdNode = (
  node: NodeType,
  minimumAuctionQualifiedStake?: string
) => {
  const bNqualifiedStake = new BigNumber(node.qualifiedStake ?? 0);
  const bNMinimumAuctionStake = new BigNumber(
    minimumAuctionQualifiedStake ?? 0
  );

  return (
    bNqualifiedStake.isGreaterThanOrEqualTo(bNMinimumAuctionStake) &&
    node.auctionQualified
  );
};

export const NodesTableBody = ({
  nodes,
  statistics,
  queue,
  type,
  status,
  auctionList,
  showPosition = true
}: NodesTableBodyUIType) => {
  const {
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);
  const { search } = useGetSearch();
  const { sort, order } = useGetSort();
  const { status: nodeStatus, ...nodeFilters } = useGetNodeFilters();

  const isAuctionSortDesc =
    sort === 'qualifiedStake' && order === SortOrderEnum.desc;
  const hasNoFilters = [search, ...Object.keys(nodeFilters)].every(
    (el) => el === undefined
  );

  const thresholdIndex = isAuctionSortDesc
    ? nodes.findIndex((node) =>
        findThresholdNode(node, minimumAuctionQualifiedStake)
      )
    : nodes.findLastIndex((node) =>
        findThresholdNode(node, minimumAuctionQualifiedStake)
      );

  let colSpan = 8;
  if (queue) {
    colSpan = 5;
  }
  if (status === 'auction') {
    colSpan = showPosition ? 10 : 9;
  }
  if (auctionList) {
    colSpan = showPosition ? 7 : 6;
  }

  return (
    <tbody>
      {nodes.map((nodeData, index) => {
        const showThresholdRow = Boolean(
          thresholdIndex && index === thresholdIndex && hasNoFilters
        );

        if (statistics) {
          return <StatisticsRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (queue) {
          return <QueueRow nodeData={nodeData} key={nodeData.bls} />;
        }
        if (auctionList) {
          return (
            <AuctionRow
              nodeData={nodeData}
              key={nodeData.bls}
              showThresholdRow={showThresholdRow}
              index={index + 1}
              showPosition={showPosition}
            />
          );
        }

        return (
          <StandardRow
            nodeData={nodeData}
            index={index + 1}
            type={type}
            status={status}
            key={nodeData.bls}
            showThresholdRow={showThresholdRow}
            showPosition={showPosition}
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
