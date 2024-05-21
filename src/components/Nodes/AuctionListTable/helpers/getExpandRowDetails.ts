import BigNumber from 'bignumber.js';

import {
  PAGE_SIZE,
  AUCTION_LIST_MIN_DISPLAY_ROW_COUNT,
  AUCTION_LIST_QUALIFIED_MIN_DISPLAY_ROW_COUNT
} from 'appConstants';
import { AuctionValidatorType } from 'types';

import { ExpandRowDetailsType } from '../types';

const isQualified = (validator: AuctionValidatorType) => {
  return new BigNumber(validator.qualifiedAuctionValidators ?? 0).isGreaterThan(
    0
  );
};
const isNotQualified = (validator: AuctionValidatorType) => {
  return new BigNumber(validator.qualifiedAuctionValidators ?? 0).isZero();
};

export const getExpandRowDetails = (
  validators: AuctionValidatorType[] = []
): ExpandRowDetailsType => {
  const hasMinElements = validators.length >= PAGE_SIZE;
  const DISPLAY_ROWS = Math.floor(AUCTION_LIST_MIN_DISPLAY_ROW_COUNT / 2);
  const QUALIFIED_DISPLAY_ROWS = Math.floor(
    AUCTION_LIST_QUALIFIED_MIN_DISPLAY_ROW_COUNT / 2
  );

  let qualifiedExpandPosition,
    qualifiedExpandClosePosition,
    remainingQualifiedValidators,
    notQualifiedExpandPosition,
    notQualifiedExpandClosePosition,
    remainingNotQualifiedValidators;

  const qualifiedValidators = validators.filter(isQualified) ?? [];
  const notQualifiedValidators = validators.filter(isNotQualified) ?? [];

  if (
    hasMinElements &&
    qualifiedValidators.length >=
      AUCTION_LIST_QUALIFIED_MIN_DISPLAY_ROW_COUNT + 3
  ) {
    const qualifiedFirst = validators.findIndex(isQualified);
    const qualifiedLast = validators.findLastIndex(isQualified);
    qualifiedExpandPosition = qualifiedFirst + QUALIFIED_DISPLAY_ROWS;
    qualifiedExpandClosePosition = qualifiedLast - QUALIFIED_DISPLAY_ROWS;

    remainingQualifiedValidators =
      qualifiedValidators.length - AUCTION_LIST_QUALIFIED_MIN_DISPLAY_ROW_COUNT;
  }
  if (
    hasMinElements &&
    notQualifiedValidators.length >= AUCTION_LIST_MIN_DISPLAY_ROW_COUNT + 3
  ) {
    const notQualifiedFirst = validators.findIndex(isNotQualified);
    const notQualifiedLast = validators.findLastIndex(isNotQualified);
    notQualifiedExpandPosition = notQualifiedFirst + DISPLAY_ROWS;
    notQualifiedExpandClosePosition = notQualifiedLast - DISPLAY_ROWS;

    remainingNotQualifiedValidators =
      notQualifiedValidators.length - AUCTION_LIST_MIN_DISPLAY_ROW_COUNT;
  }

  return {
    qualifiedExpandPosition,
    qualifiedExpandClosePosition,
    remainingQualifiedValidators,
    notQualifiedExpandPosition,
    notQualifiedExpandClosePosition,
    remainingNotQualifiedValidators
  };
};
