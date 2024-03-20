import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as DefaultAvatar } from 'assets/img/default-avatar.svg';
import {
  NetworkLink,
  AccountLink,
  FormatAmount,
  TransactionActionBlock,
  NftBadge
} from 'components';
import { addressIsBech32, urlBuilder } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';
import {
  NftTypeEnum,
  TransactionTokenArgumentType,
  TransactionType
} from 'types';
import { unwrapper } from './helpers/unwrapper';

export const ActionToken = ({
  token,
  noValue,
  showLastNonZeroDecimal
}: {
  token: TransactionTokenArgumentType;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  if (
    token.type &&
    Object.values(NftTypeEnum).includes(token.type as NftTypeEnum)
  ) {
    switch (token.type) {
      case NftTypeEnum.SemiFungibleESDT:
        return (
          <div>
            <NftBadge type={token.type} className='me-1' />
            <TransactionActionBlock.Nft
              token={token}
              noValue={noValue}
              showLastNonZeroDecimal={showLastNonZeroDecimal}
            />
            <span>of collection</span>
            <TransactionActionBlock.Collection token={token} />
          </div>
        );
      case NftTypeEnum.NonFungibleESDT:
        return (
          <div>
            <NftBadge type={token.type} className='me-1' />
            <TransactionActionBlock.Nft
              token={token}
              noValue={noValue}
              showLastNonZeroDecimal={showLastNonZeroDecimal}
            />
            <span>of collection</span>
            <TransactionActionBlock.Collection token={token} />
          </div>
        );
      case NftTypeEnum.MetaESDT:
        return (
          <TransactionActionBlock.Nft
            token={token}
            noValue={noValue}
            showLastNonZeroDecimal={showLastNonZeroDecimal}
          />
        );
      default:
        return null;
    }
  } else {
    return (
      <TransactionActionBlock.Token
        token={token}
        noValue={noValue}
        showLastNonZeroDecimal={showLastNonZeroDecimal}
      />
    );
  }
};

const ActionText = ({
  entry,
  transaction
}: {
  entry: any;
  transaction: TransactionType;
}) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  switch (true) {
    case typeof entry === 'string':
      return <span>{entry.replace('eGLD', egldLabel)}</span>;

    case Boolean(entry.address):
      let entryAssets;
      if (entry.address === transaction.sender) {
        entryAssets = transaction.senderAssets;
      }
      if (entry.address === transaction.receiver) {
        entryAssets = transaction.receiverAssets;
      }
      if (
        entry.address === transaction?.action?.arguments?.receiver &&
        transaction?.action?.arguments?.receiverAssets
      ) {
        entryAssets = transaction.action.arguments.receiverAssets;
      }

      return addressIsBech32(entry.address) ? (
        <AccountLink
          address={entry.address}
          assets={entryAssets}
          data-testid='receiverLink'
        />
      ) : (
        ''
      );

    case Boolean(entry.token && entry.token.length > 0):
      return entry.token.map(
        (token: TransactionTokenArgumentType, index: number) => (
          <div key={`tx-${token.identifier}-${index}`}>
            <ActionToken token={token} showLastNonZeroDecimal />
            {index < entry.token.length - 1 && (
              <span className='ms-n1 me-1 d-none d-sm-flex'>,</span>
            )}
          </div>
        )
      );

    case Boolean(entry.tokenNoValue && entry.tokenNoValue.length > 0):
      return entry.tokenNoValue.map(
        (tokenNoValue: TransactionTokenArgumentType, index: number) => (
          <div key={`tx-${tokenNoValue.token}-${index}`}>
            <ActionToken token={tokenNoValue} noValue showLastNonZeroDecimal />
            {index < entry.tokenNoValue.length - 1 && (
              <span className='ms-n1 me-1 d-none d-sm-flex'>,</span>
            )}
          </div>
        )
      );

    case Boolean(entry.tokenNoLink && entry.tokenNoLink.length > 0):
      return entry.tokenNoLink.map(
        (tokenNoLink: TransactionTokenArgumentType, index: number) => (
          <div key={`tx-${tokenNoLink.token}-${index}`}>
            <span className='me-1'>{tokenNoLink.ticker}</span>
            {index < entry.tokenNoLink.length - 1 && (
              <span className='ms-n1 me-1 d-none d-sm-flex'>,</span>
            )}
          </div>
        )
      );

    case Boolean(entry.value):
      return (
        <span>
          <FormatAmount
            value={entry.value}
            showLabel={false}
            showSymbol={false}
            showLastNonZeroDecimal
          />
        </span>
      );

    case Boolean(entry.egldValue):
      return (
        <span>
          <FormatAmount value={entry.egldValue} showLastNonZeroDecimal />
        </span>
      );

    case Boolean(entry.providerName):
      return (
        <span className='d-flex'>
          <NetworkLink
            to={urlBuilder.providerDetails(transaction.receiver)}
            className='d-flex align-self-center'
          >
            {entry.providerAvatar ? (
              <img
                src={entry.providerAvatar}
                className='side-icon rounded-circle ms-lg-1 me-2'
                alt=' '
              />
            ) : (
              <DefaultAvatar className='side-icon rounded-circle ms-lg-1 me-2' />
            )}
            {entry.providerName}
          </NetworkLink>
        </span>
      );

    default:
      return null;
  }
};

export const TransactionAction = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const [unwrappedResult, setUnwrappedResult] = useState<
    ReturnType<typeof unwrapper>
  >([]);

  useEffect(() => {
    if (transaction.action) {
      const result = unwrapper(transaction.action);
      setUnwrappedResult(result);
    }
  }, [transaction.action]);

  return (
    <div className='transaction-action d-flex flex-column flex-lg-row flex-lg-wrap text-lh-24'>
      {unwrappedResult.map((entry, i) => (
        <div key={JSON.stringify(unwrappedResult) + i} className='action-step'>
          <ActionText entry={entry} transaction={transaction} />
        </div>
      ))}
    </div>
  );
};
