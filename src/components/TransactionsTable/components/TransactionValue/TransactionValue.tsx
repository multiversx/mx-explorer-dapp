import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

import { FormatAmount, TransactionActionBlock, Overlay } from 'components';
import { getTransactionTokens } from 'helpers';
import { faLayerPlus } from 'icons/regular';
import { UITransactionType, NftTypeEnum, TransactionActionEnum } from 'types';

const MultipleTokensBadge = ({
  transactionTokens
}: {
  transactionTokens: any[];
}) => {
  const Tooltip = () => (
    <div className='py-2 px-1'>
      {transactionTokens.map((transactionToken, index) => (
        <div
          key={`tx-token-tooltip-${index}`}
          className={`d-flex align-items-center ${index > 0 ? 'pt-2' : ''}`}
        >
          {Object.values(NftTypeEnum).includes(transactionToken.type) ? (
            <TransactionActionBlock.Nft token={transactionToken} showBadge />
          ) : (
            <TransactionActionBlock.Token token={transactionToken} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Overlay title={<Tooltip />} className='multiple-tokens' persistent>
      <FontAwesomeIcon icon={faLayerPlus} className='ms-1 text-neutral-400' />
    </Overlay>
  );
};

export const TransactionValue = ({
  transaction,
  token,
  hideMultipleBadge
}: {
  transaction: UITransactionType;
  token?: string;
  hideMultipleBadge?: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const { token: filterToken } = Object.fromEntries(searchParams);

  if (transaction.action) {
    if (
      transaction.action.name === TransactionActionEnum.wrapEgld ||
      transaction.action.name === TransactionActionEnum.unwrapEgld
    ) {
      return <FormatAmount value={transaction.value} />;
    }

    const transactionTokens = getTransactionTokens({
      transaction,
      token: token ?? filterToken
    });
    const transactionActionValue =
      transactionTokens.length === 1 &&
      transaction?.action?.arguments?.value !== undefined
        ? transaction.action.arguments.value
        : undefined;

    if (transactionTokens.length) {
      const firstToken = transactionTokens[0];
      return (
        <div className='d-flex align-items-center'>
          {Object.values(NftTypeEnum).includes(firstToken.type) ? (
            <TransactionActionBlock.Nft
              token={firstToken}
              transactionActionValue={transactionActionValue}
              showBadge
            />
          ) : (
            <TransactionActionBlock.Token token={firstToken} />
          )}
          {!hideMultipleBadge && transactionTokens.length > 1 && (
            <MultipleTokensBadge transactionTokens={transactionTokens} />
          )}
        </div>
      );
    }
  }

  return <FormatAmount value={transaction.value} />;
};
