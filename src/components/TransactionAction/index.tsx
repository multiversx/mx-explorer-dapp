import * as React from 'react';
import { ScAddressIcon, NetworkLink, AccountName, Denominate, TxActionBlock } from 'components';
import { addressIsBech32, urlBuilder } from 'helpers';
import { NftEnumType } from 'types';
import { TokenArgumentType, TransactionType } from 'types';
import { unwrapper } from './unwrapper';
import { ReactComponent as DefaultAvatar } from 'assets/img/default-avatar.svg';

export const ActionToken = ({
  token,
  noValue,
  showLastNonZeroDecimal,
}: {
  token: TokenArgumentType;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  if (token.type && ['MetaESDT', 'SemiFungibleESDT', 'NonFungibleESDT'].includes(token.type)) {
    switch (token.type) {
      case NftEnumType.SemiFungibleESDT:
        return (
          <div>
            <span>SFT quantity</span>
            <TxActionBlock.Nft
              token={token}
              noValue={noValue}
              showLastNonZeroDecimal={showLastNonZeroDecimal}
            />
            <span>of collection</span>
            <TxActionBlock.Collection token={token} />
          </div>
        );
      case NftEnumType.NonFungibleESDT:
        return (
          <div>
            <span>NFT</span>
            <TxActionBlock.Nft
              token={token}
              noValue={noValue}
              showLastNonZeroDecimal={showLastNonZeroDecimal}
            />
            <span>of collection</span>
            <TxActionBlock.Collection token={token} />
          </div>
        );
      case NftEnumType.MetaESDT:
        return (
          <TxActionBlock.Nft
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
      <TxActionBlock.Token
        token={token}
        noValue={noValue}
        showLastNonZeroDecimal={showLastNonZeroDecimal}
      />
    );
  }
};

const ActionText = ({ entry, transaction }: { entry: any; transaction: TransactionType }) => {
  switch (true) {
    case typeof entry === 'string':
      return <span>{entry.replace('eGLD', 'EGLD')}</span>;

    case Boolean(entry.address):
      let entryAssets;
      if (entry.address === transaction.sender) {
        entryAssets = transaction.senderAssets;
      }
      if (entry.address === transaction.receiver) {
        entryAssets = transaction.receiverAssets;
      }
      return addressIsBech32(entry.address) ? (
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={entry.address} />
          <NetworkLink
            to={urlBuilder.accountDetails(entry.address)}
            data-testid="receiverLink"
            className="trim-wrapper"
          >
            <AccountName address={entry.address} assets={entryAssets} />
          </NetworkLink>
        </div>
      ) : (
        ''
      );

    case Boolean(entry.token && entry.token.length > 0):
      return entry.token.map((token: TokenArgumentType, index: number) => (
        <div key={`tx-${token.identifier}-${index}`}>
          <ActionToken token={token} showLastNonZeroDecimal />
          {index < entry.token.length - 1 && <span className="ms-n1 me-1 d-none d-sm-flex">,</span>}
        </div>
      ));

    case Boolean(entry.tokenNoValue && entry.tokenNoValue.length > 0):
      return entry.tokenNoValue.map((tokenNoValue: TokenArgumentType, index: number) => (
        <div key={`tx-${tokenNoValue.token}-${index}`}>
          <ActionToken token={tokenNoValue} noValue showLastNonZeroDecimal />
          {index < entry.tokenNoValue.length - 1 && (
            <span className="ms-n1 me-1 d-none d-sm-flex">,</span>
          )}
        </div>
      ));

    case Boolean(entry.tokenNoLink && entry.tokenNoLink.length > 0):
      return entry.tokenNoLink.map((tokenNoLink: TokenArgumentType, index: number) => (
        <div key={`tx-${tokenNoLink.token}-${index}`}>
          <span className="me-1">{tokenNoLink.ticker}</span>
          {index < entry.tokenNoLink.length - 1 && (
            <span className="ms-n1 me-1 d-none d-sm-flex">,</span>
          )}
        </div>
      ));

    case Boolean(entry.value):
      return (
        <span>
          <Denominate value={entry.value} showLabel={false} showLastNonZeroDecimal />
        </span>
      );

    case Boolean(entry.egldValue):
      return (
        <span>
          <Denominate value={entry.egldValue} showLastNonZeroDecimal />
        </span>
      );

    case Boolean(entry.providerName):
      return (
        <span className="d-flex">
          <NetworkLink
            to={urlBuilder.providerDetails(transaction.receiver)}
            className="d-flex align-self-center"
          >
            {entry.providerAvatar ? (
              <img
                src={entry.providerAvatar}
                className="side-icon rounded-circle ms-lg-1 me-2"
                alt=" "
              />
            ) : (
              <DefaultAvatar className="side-icon rounded-circle ms-lg-1 me-2" />
            )}
            {entry.providerName}
          </NetworkLink>
        </span>
      );

    default:
      return null;
  }
};

export const TransactionAction = ({ transaction }: { transaction: TransactionType }) => {
  const [unwrappedResult, setUnwrappedResult] = React.useState<ReturnType<typeof unwrapper>>([]);

  React.useEffect(() => {
    if (transaction.action) {
      const result = unwrapper(transaction.action);
      setUnwrappedResult(result);
    }
  }, [transaction.action]);

  return (
    <div className="transaction-action d-flex flex-column flex-lg-row flex-lg-wrap">
      {unwrappedResult.map((entry, i) => (
        <div key={JSON.stringify(unwrappedResult) + i} className="action-step">
          <ActionText entry={entry} transaction={transaction} />
        </div>
      ))}
    </div>
  );
};
