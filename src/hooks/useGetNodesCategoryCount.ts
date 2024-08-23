import { useSelector } from 'react-redux';

import {
  stakeSelector,
  stakeExtraSelector,
  nodesOverviewSelector
} from 'redux/selectors';
import { NodeStatusEnum, NodeTypeEnum } from 'types';

export const useGetNodesCategoryCount = ({
  showGlobalValues
}: {
  showGlobalValues?: boolean;
}) => {
  const {
    unprocessed: { queueSize, auctionValidators, totalObservers }
  } = useSelector(stakeSelector);
  const {
    unprocessed: { totalNodes, totalValidatorNodes }
  } = useSelector(stakeExtraSelector);
  const { nodes, isFetched: isNodesOverviewFetched } = useSelector(
    nodesOverviewSelector
  );

  if (showGlobalValues) {
    return {
      totalNodes,
      totalValidatorNodes,
      auctionValidators,
      queueSize,
      totalObservers
    };
  }

  if (isNodesOverviewFetched && nodes.length > 0) {
    const overviewTotal = nodes.length;
    const overviewValidatorNodes = nodes.filter(
      (node) => node.type === NodeTypeEnum.validator
    ).length;
    const overviewAuctionValidators = nodes.filter(
      (node) =>
        (node.status === NodeStatusEnum.auction || node.auctionQualified) &&
        node.type === NodeTypeEnum.validator
    ).length;
    const overviewQueueSize = nodes.filter(
      (node) =>
        node.status === NodeStatusEnum.queued &&
        node.type === NodeTypeEnum.validator
    ).length;
    const overviewTotalObservers = nodes.filter(
      (node) => node.type === NodeTypeEnum.observer
    ).length;

    return {
      totalNodes: overviewTotal,
      totalValidatorNodes: overviewValidatorNodes,
      auctionValidators: overviewAuctionValidators,
      queueSize: overviewQueueSize,
      totalObservers: overviewTotalObservers
    };
  }

  return {};
};
