import React from 'react';
import { faBan } from '@fortawesome/pro-solid-svg-icons/faBan';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faHourglass } from '@fortawesome/pro-solid-svg-icons/faHourglass';
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes';

import {
  TransactionApiStatusEnum,
  TransactionExtraStatusEnum,
  UITransactionType
} from 'types';

interface TransactionStatusType {
  transaction: UITransactionType;
}

export const getTransactionStatusIconAndColor = ({
  transaction
}: TransactionStatusType) => {
  const statusIs = (compareTo: string) => transaction.status === compareTo;
  let icon;
  let color = '';

  if (!transaction) {
    return {
      color,
      icon
    };
  }

  switch (true) {
    case transaction.pendingResults:
    case statusIs(TransactionApiStatusEnum.pending):
      return {
        color: 'warning',
        icon: faHourglass
      };

    case statusIs(TransactionExtraStatusEnum.notExecuted):
      return {
        color: 'danger',
        icon: faBan
      };

    case statusIs(TransactionApiStatusEnum.fail):
    case statusIs(TransactionExtraStatusEnum.failed):
    case statusIs(TransactionExtraStatusEnum.rewardReverted):
      return {
        color: 'danger',
        icon: faTimes
      };

    case statusIs(TransactionApiStatusEnum.success):
      return {
        color: 'success',
        icon: faCheckCircle
      };

    case statusIs(TransactionApiStatusEnum.invalid):
      return {
        color: 'danger',
        icon: faBan
      };

    default:
      return {
        color,
        icon
      };
  }
};
