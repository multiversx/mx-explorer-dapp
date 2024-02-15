import { PAGE_SIZE, EXPAND_AUCTION_LIST_ROW_POSITION } from 'appConstants';
import { NodeType } from 'types';

export const getExpandRowDetails = (nodes: NodeType[] = []) => {
  const MIN_ROW_COUNT = 8;
  const MIN_DISPLAY_ROW_COUNT = 6;

  const hasMinElements = nodes.length >= PAGE_SIZE;
  let qualifiedExpandPosition,
    dangerZoneExpandPosition,
    notQualifiedExpandPosition,
    remainingQualifiedValidators,
    remainingDangerZoneValidators,
    remainingNotQualifiedValidators;

  const qualifiedNotInDangerZoneValidators = nodes.filter(
    (node) => node.auctionQualified && !node.isInDangerZone
  );
  const dangerZoneValidators = nodes.filter((nodes) => nodes.isInDangerZone);
  const notQualifiedValidators = nodes.filter((node) => !node.auctionQualified);

  if (
    hasMinElements &&
    qualifiedNotInDangerZoneValidators.length > MIN_ROW_COUNT
  ) {
    qualifiedExpandPosition =
      qualifiedNotInDangerZoneValidators[EXPAND_AUCTION_LIST_ROW_POSITION]
        .auctionPosition;
    qualifiedNotInDangerZoneValidators;
    remainingQualifiedValidators =
      qualifiedNotInDangerZoneValidators.length - MIN_DISPLAY_ROW_COUNT;
  }
  if (hasMinElements && dangerZoneValidators.length > MIN_ROW_COUNT) {
    dangerZoneExpandPosition =
      qualifiedNotInDangerZoneValidators[EXPAND_AUCTION_LIST_ROW_POSITION]
        .auctionPosition;
    remainingDangerZoneValidators =
      dangerZoneValidators.length - MIN_DISPLAY_ROW_COUNT;
  }
  if (hasMinElements && notQualifiedValidators.length > MIN_ROW_COUNT) {
    notQualifiedExpandPosition =
      qualifiedNotInDangerZoneValidators[EXPAND_AUCTION_LIST_ROW_POSITION]
        .auctionPosition;
    remainingNotQualifiedValidators =
      notQualifiedValidators.length - MIN_DISPLAY_ROW_COUNT;
  }

  return {
    qualifiedExpandPosition,
    dangerZoneExpandPosition,
    notQualifiedExpandPosition,
    remainingQualifiedValidators,
    remainingDangerZoneValidators,
    remainingNotQualifiedValidators
  };
};
