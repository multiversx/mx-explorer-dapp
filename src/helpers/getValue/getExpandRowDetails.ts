import { PAGE_SIZE, AUCTION_LIST_MIN_DISPLAY_ROW_COUNT } from 'appConstants';
import { NodeType } from 'types';

export interface ExpandRowDetailsType {
  qualifiedExpandPosition: number | undefined;
  qualifiedExpandClosePosition: number | undefined;
  remainingQualifiedValidators: number | undefined;
  dangerZoneExpandPosition: number | undefined;
  dangerZoneExpandClosePosition: number | undefined;
  remainingDangerZoneValidators: number | undefined;
  notQualifiedExpandPosition: number | undefined;
  notQualifiedExpandClosePosition: number | undefined;
  remainingNotQualifiedValidators: number | undefined;
}

const isQualified = (node: NodeType) => {
  return node.auctionQualified && !node.isInDangerZone;
};
const isDangerZone = (node: NodeType) => {
  return node.isInDangerZone && node.auctionQualified;
};
const isNotQualified = (node: NodeType) => {
  return !node.auctionQualified;
};
const isQualifiedIncludingDangerZone = (node: NodeType) => {
  return node.auctionQualified;
};

export const getExpandRowDetails = (
  nodes: NodeType[] = [],
  hasDangerZone?: boolean
): ExpandRowDetailsType => {
  const MIN_ROW_COUNT = 9;

  const hasMinElements = nodes.length >= PAGE_SIZE;
  const displayRows = Math.floor(AUCTION_LIST_MIN_DISPLAY_ROW_COUNT / 2);

  let qualifiedExpandPosition,
    qualifiedExpandClosePosition,
    remainingQualifiedValidators,
    dangerZoneExpandPosition,
    dangerZoneExpandClosePosition,
    remainingDangerZoneValidators,
    notQualifiedExpandPosition,
    notQualifiedExpandClosePosition,
    remainingNotQualifiedValidators;

  const qualifiedNotInDangerZoneValidators =
    nodes.filter(
      hasDangerZone ? isQualified : isQualifiedIncludingDangerZone
    ) ?? [];
  const dangerZoneValidators = hasDangerZone
    ? nodes.filter(isDangerZone) ?? []
    : [];
  const notQualifiedValidators = nodes.filter(isNotQualified) ?? [];

  if (
    hasMinElements &&
    qualifiedNotInDangerZoneValidators.length >= MIN_ROW_COUNT
  ) {
    const qualifiedFirst = nodes.findIndex(
      hasDangerZone ? isQualified : isQualifiedIncludingDangerZone
    );
    const qualifiedLast = nodes.findLastIndex(
      hasDangerZone ? isQualified : isQualifiedIncludingDangerZone
    );
    qualifiedExpandPosition = qualifiedFirst + 1 + displayRows;
    qualifiedExpandClosePosition = qualifiedLast + 1 - displayRows;

    remainingQualifiedValidators =
      qualifiedNotInDangerZoneValidators.length -
      AUCTION_LIST_MIN_DISPLAY_ROW_COUNT;
  }
  if (hasMinElements && dangerZoneValidators.length >= MIN_ROW_COUNT) {
    const dangerZoneFirst = nodes.findIndex(isDangerZone);
    const dangerZoneLast = nodes.findLastIndex(isDangerZone);
    dangerZoneExpandPosition = dangerZoneFirst + 1 + displayRows;
    dangerZoneExpandClosePosition = dangerZoneLast + 1 - displayRows;

    remainingDangerZoneValidators =
      dangerZoneValidators.length - AUCTION_LIST_MIN_DISPLAY_ROW_COUNT;
  }
  if (hasMinElements && notQualifiedValidators.length >= MIN_ROW_COUNT) {
    const notQualifiedFirst = nodes.findIndex(isNotQualified);
    const notQualifiedLast = nodes.findLastIndex(isNotQualified);
    notQualifiedExpandPosition = notQualifiedFirst + 1 + displayRows;
    notQualifiedExpandClosePosition = notQualifiedLast + 1 - displayRows;

    remainingNotQualifiedValidators =
      notQualifiedValidators.length - AUCTION_LIST_MIN_DISPLAY_ROW_COUNT;
  }

  return {
    qualifiedExpandPosition,
    qualifiedExpandClosePosition,
    remainingQualifiedValidators,
    dangerZoneExpandPosition,
    dangerZoneExpandClosePosition,
    remainingDangerZoneValidators,
    notQualifiedExpandPosition,
    notQualifiedExpandClosePosition,
    remainingNotQualifiedValidators
  };
};
