import { UITransactionType } from 'types';

export const getTransactionTokens = ({
  transaction,
  token
}: {
  transaction: UITransactionType;
  token?: string;
}) => {
  if (transaction.action) {
    const transactionTokens = [
      ...(transaction.action.arguments?.token
        ? [transaction.action.arguments?.token]
        : []),
      ...(transaction.action.arguments?.token1
        ? [transaction.action.arguments?.token1]
        : []),
      ...(transaction.action.arguments?.token2
        ? [transaction.action.arguments?.token2]
        : []),
      ...(transaction.action.arguments?.transfers
        ? transaction.action.arguments?.transfers
        : [])
    ];

    if (token) {
      const reorderedTransactionTokens = [
        ...transactionTokens.filter(
          (transactionToken) => transactionToken?.token === token
        ),
        ...transactionTokens.filter(
          (transactionToken) => !(transactionToken?.token === token)
        )
      ];

      return reorderedTransactionTokens;
    }

    return transactionTokens;
  }

  return [];
};
