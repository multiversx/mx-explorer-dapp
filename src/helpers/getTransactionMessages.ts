import BigNumber from 'bignumber.js';

import { denominate } from 'components/Denominate/denominate';
import { DECIMALS, DIGITS } from 'config';
import {
  TransactionType,
  TransactionTokenArgumentType,
  NftTypeEnum
} from 'types';

enum TransactionMessagesEnum {
  newNFTData = 'new nft data on sender',
  invalidLiquidity = 'invalid liquidity for esdt',
  nilUserAccount = 'nil user account'
}

// Temporarily show more meaningful error messages
const getDisplayMessages = ({
  message,
  transaction
}: {
  message?: string;
  transaction: TransactionType;
}) => {
  const compareMessage = message?.toLowerCase();
  switch (true) {
    case compareMessage?.includes(TransactionMessagesEnum.newNFTData):
      const transactionActionTransfers =
        transaction?.action?.arguments?.transfers ?? [];
      if (transactionActionTransfers.length === 1) {
        return `Not enough balance of ${getTokenDisplayType(
          transactionActionTransfers[0].type
        )} ${transactionActionTransfers[0].identifier}`;
      }
      return 'Not enough balance of transferred token';
    case compareMessage?.includes(TransactionMessagesEnum.invalidLiquidity):
      return 'One of the selected tokens was temporarily immovable due to a pending ESDT protocol upgrade. Protocol update has been successfully deployed at epoch 811.';
    case compareMessage?.includes(TransactionMessagesEnum.nilUserAccount):
      return 'Transfer role is active on token: Transaction sender or receiver is not whitelisted.';
    default:
      return message;
  }
};

const getReceiptValue = (transaction: TransactionType) => {
  if (transaction?.receipt?.value) {
    if (
      transaction?.receipt?.data &&
      transaction.receipt.data === 'refundedGas'
    ) {
      const denominatedGas = denominate({
        input: transaction.receipt.value,
        denomination: DECIMALS,
        decimals: DIGITS,
        showLastNonZeroDecimal: true
      });
      const gasRefunded = new BigNumber(denominatedGas)
        .times(transaction.gasPrice)
        .times(100);

      return gasRefunded.toFixed();
    }

    return transaction.receipt.value;
  }

  return '';
};

const getTokenDisplayType = (type: TransactionTokenArgumentType['type']) => {
  switch (type) {
    case NftTypeEnum.NonFungibleESDT:
      return 'NFT';
    case NftTypeEnum.SemiFungibleESDT:
      return 'SFT';
    default:
      return 'token';
  }
};

export const getReceiptMessages = (transaction: TransactionType) => {
  if (transaction?.receipt?.data) {
    const message = transaction.receipt.data;
    const receiptValue = getReceiptValue(transaction);
    const value = receiptValue ? `: ${receiptValue}` : '';

    return [`${message}${value}`];
  } else {
    return [];
  }
};

export const getOperationsMessages = (transaction: TransactionType) => {
  const messages =
    transaction?.operations
      ?.map((operation) =>
        getDisplayMessages({ message: operation.message, transaction })
      )
      .filter((messages): messages is string => Boolean(messages)) ?? [];

  return messages;
};

export const getScResultsMessages = (transaction: TransactionType) => {
  const messages =
    transaction?.results
      ?.map((result) =>
        getDisplayMessages({ message: result.returnMessage, transaction })
      )
      .filter((messages): messages is string => Boolean(messages)) ?? [];

  return messages;
};

export const getTransactionMessages = (transaction: TransactionType) => {
  const transactionMessages = Array.from(
    new Set([
      ...getScResultsMessages(transaction),
      ...getOperationsMessages(transaction),
      ...getReceiptMessages(transaction)
    ])
  );

  return transactionMessages;
};
