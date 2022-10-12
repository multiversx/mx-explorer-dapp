import BigNumber from 'bignumber.js';
import { TransactionType, TokenArgumentType, NftEnumType } from 'helpers/types';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';

enum TransactionMessagesEnum {
  newNFTData = 'new NFT data on sender',
  invalidLiquidity = 'invalid liquidity for ESDT',
}

// Temporarily show more meaningful error messages
const getDisplayMessages = ({
  message,
  transaction,
}: {
  message?: string;
  transaction: TransactionType;
}) => {
  switch (true) {
    case message === TransactionMessagesEnum.newNFTData:
      const transactionActionTransfers = transaction?.action?.arguments?.transfers ?? [];
      if (transactionActionTransfers.length === 1) {
        return `Not enough balance of ${getTokenDisplayType(transactionActionTransfers[0].type)} ${
          transactionActionTransfers[0].identifier
        }`;
      }
      return 'Not enough balance of transferred token';
    // Temporary ?
    case message?.includes(TransactionMessagesEnum.invalidLiquidity):
      return 'One of the selected tokens is temporarily immovable due to a pending ESDT protocol upgrade being deployed on October 19th. Please check again later.';
    default:
      return message;
  }
};

const getReceiptValue = (transaction: TransactionType) => {
  if (transaction?.receipt?.value) {
    if (transaction?.receipt?.data && transaction.receipt.data === 'refundedGas') {
      const denominatedGas = denominate({
        input: transaction.receipt.value,
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
      });
      const gasRefunded = new BigNumber(denominatedGas).times(transaction.gasPrice).times(100);

      return gasRefunded.toFixed();
    }

    return transaction.receipt.value;
  }

  return '';
};

const getTokenDisplayType = (type: TokenArgumentType['type']) => {
  switch (type) {
    case NftEnumType.NonFungibleESDT:
      return 'NFT';
    case NftEnumType.SemiFungibleESDT:
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
      ?.map((operation) => getDisplayMessages({ message: operation.message, transaction }))
      .filter((messages): messages is string => Boolean(messages)) ?? [];

  return messages;
};

export const getScResultsMessages = (transaction: TransactionType) => {
  const messages =
    transaction?.results
      ?.map((result) => getDisplayMessages({ message: result.returnMessage, transaction }))
      .filter((messages): messages is string => Boolean(messages)) ?? [];

  return messages;
};

const getTransactionMessages = (transaction: TransactionType) => {
  const transactionMessages = Array.from(
    new Set([
      ...getScResultsMessages(transaction),
      ...getOperationsMessages(transaction),
      ...getReceiptMessages(transaction),
    ])
  );

  return transactionMessages;
};

export default getTransactionMessages;
