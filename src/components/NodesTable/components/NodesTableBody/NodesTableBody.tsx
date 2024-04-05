import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { PAGE_SIZE, AUCTION_LIST_MAX_NODES, ZERO } from 'appConstants';
import { PageState } from 'components';
import { getExpandRowDetails, ExpandRowDetailsType } from 'helpers';
import { useGetNodeFilters, useGetPage, useGetSearch, useGetSort } from 'hooks';
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
  type?: NodeType['type'];
  status?: NodeType['status'];
  auctionList?: boolean;
  showPosition?: boolean;
}

export interface ExpandRowConfigType extends ExpandRowDetailsType {
  qualifiedExpanded: boolean;
  dangerZoneExpanded: boolean;
  notQualifiedExpanded: boolean;
  setQualifiedExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setDangerZoneExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setNotQualifiedExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const findTresholdNode = (
  node: NodeType,
  minimumAuctionQualifiedStake?: string
) => {
  const bNLocked = new BigNumber(node.stake).plus(
    node.auctionQualified ? node.auctionTopUp ?? 0 : 0
  );
  const bNMinimumAuctionStake = new BigNumber(
    minimumAuctionQualifiedStake ?? 0
  );

  //TODO - remove when api issue is fixed - node is qualified / issue on locked values
  if (bNLocked.isLessThan(node.auctionTopUp ?? ZERO)) {
    return true;
  }

  return (
    bNLocked.isGreaterThanOrEqualTo(bNMinimumAuctionStake) &&
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
  showPosition
}: NodesTableBodyUIType) => {
  const {
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);
  const { search } = useGetSearch();
  const { sort, order } = useGetSort();
  const { size: pageSize } = useGetPage();
  const { status: nodeStatus, ...nodeFilters } = useGetNodeFilters();

  const [qualifiedExpanded, setQualifiedExpanded] = useState(false);
  const [dangerZoneExpanded, setDangerZoneExpanded] = useState(false);
  const [notQualifiedExpanded, setNotQualifiedExpanded] = useState(false);

  const isAuctionSortDesc =
    (sort === 'auctionPosition' && order === SortOrderEnum.desc) ||
    (sort === 'locked' && order === SortOrderEnum.asc);
  const hasNoFilters =
    [search, ...Object.keys(nodeFilters)].every((el) => el === undefined) &&
    ((sort === undefined && auctionList) ||
      sort === 'auctionPosition' ||
      sort === 'locked');
  const isCustomSize = ![PAGE_SIZE, AUCTION_LIST_MAX_NODES].includes(pageSize);

  const tresholdIndex = isAuctionSortDesc
    ? nodes.findIndex((node) =>
        findTresholdNode(node, minimumAuctionQualifiedStake)
      )
    : nodes.findLastIndex((node) =>
        findTresholdNode(node, minimumAuctionQualifiedStake)
      );

  const nextPositionQualified = isAuctionSortDesc
    ? nodes?.[tresholdIndex >= 1 ? tresholdIndex - 1 : 0]?.auctionQualified
    : nodes?.[tresholdIndex + 1]?.auctionQualified;

  const expandRowConfig =
    auctionList && hasNoFilters && !isCustomSize
      ? ({
          ...getExpandRowDetails(nodes),
          qualifiedExpanded,
          dangerZoneExpanded,
          notQualifiedExpanded,
          setQualifiedExpanded,
          setDangerZoneExpanded,
          setNotQualifiedExpanded
        } as ExpandRowConfigType)
      : undefined;

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
        const showTresholdRow = Boolean(
          tresholdIndex &&
            index === tresholdIndex &&
            hasNoFilters &&
            !nextPositionQualified
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
              expandRowConfig={expandRowConfig}
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
            showTresholdRow={showTresholdRow}
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
