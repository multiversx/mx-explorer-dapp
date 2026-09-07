import { useMemo } from 'react';
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
  const { nodes, isDataReady: isNodesOverviewFetched } = useSelector(
    nodesOverviewSelector
  );

  const overviewCounts = useMemo(() => {
    if (!isNodesOverviewFetched || nodes.length === 0) {
      return undefined;
    }

    let validatorNodes = 0;
    let auctionValidatorNodes = 0;
    let queuedNodes = 0;
    let observerNodes = 0;

    for (const node of nodes) {
      const isValidator = node.type === NodeTypeEnum.validator;

      if (isValidator) {
        validatorNodes++;
        if (node.status === NodeStatusEnum.auction || node.auctionQualified) {
          auctionValidatorNodes++;
        }
        if (node.status === NodeStatusEnum.queued) {
          queuedNodes++;
        }
      }
      if (node.type === NodeTypeEnum.observer) {
        observerNodes++;
      }
    }

    return {
      totalNodes: nodes.length,
      totalValidatorNodes: validatorNodes,
      auctionValidators: auctionValidatorNodes,
      queueSize: queuedNodes,
      totalObservers: observerNodes
    };
  }, [nodes, isNodesOverviewFetched]);

  if (showGlobalValues) {
    return {
      totalNodes,
      totalValidatorNodes,
      auctionValidators,
      queueSize,
      totalObservers
    };
  }

  return overviewCounts ?? {};
};
