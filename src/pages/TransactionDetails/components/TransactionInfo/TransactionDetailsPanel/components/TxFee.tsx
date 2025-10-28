import { FormatAmount, FormatUSD } from 'components';
import { formatAmount, getTransactionFee } from 'helpers';
import { TransactionType } from 'types';

export const TxFee = ({ transaction }: { transaction: TransactionType }) => {
  if (transaction.fee !== undefined && transaction.gasUsed !== undefined) {
    return (
      <>
        <FormatAmount
          value={transaction.fee ?? getTransactionFee(transaction)}
          showUsdValue={false}
          showLastNonZeroDecimal
        />
        {transaction.price !== undefined && (
          <>
            {' '}
            <FormatUSD
              value={formatAmount({
                input: transaction.fee ?? getTransactionFee(transaction),
                showLastNonZeroDecimal: true
              })}
              usd={transaction.price}
              className='text-neutral-400'
            />
          </>
        )}
      </>
    );
  }

  return <span>N/A</span>;
};
