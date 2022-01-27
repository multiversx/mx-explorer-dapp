import * as React from 'react';
import {
  TokenBlock,
  NftBlock,
  CollectionBlock,
  ScAddressIcon,
  NetworkLink,
  Trim,
  Denominate,
} from 'sharedComponents';
import { addressIsBech32, urlBuilder } from 'helpers';
import { NftEnumType } from 'helpers/types';
import { TokenArgumentType, TransactionTokensType, TransactionType } from 'helpers/types';
import unwrapper from './unwrapper';
import { ReactComponent as DefaultAvatar } from 'assets/images/default-avatar.svg';

const ActionToken = ({
  token,
  transactionTokens,
}: {
  token: TokenArgumentType;
  transactionTokens?: TransactionTokensType;
}) => {
  if (token.type && ['MetaESDT', 'SemiFungibleESDT', 'NonFungibleESDT'].includes(token.type)) {
    const operationNft = transactionTokens?.nfts.filter((operationToken) => {
      return operationToken.identifier === token.identifier;
    });

    if (operationNft?.length) {
      switch (token.type) {
        case NftEnumType.SemiFungibleESDT:
          return (
            <div>
              <span>SFT quantity</span>
              <NftBlock operationToken={operationNft[0]} value={token.value} />
              <span>of collection</span>
              <CollectionBlock nft={operationNft[0]} />
            </div>
          );
        case NftEnumType.NonFungibleESDT:
          return (
            <div>
              <span>NFT</span>
              <NftBlock operationToken={operationNft[0]} value={token.value} />
              <span>of collection</span>
              <CollectionBlock nft={operationNft[0]} />
            </div>
          );
        case NftEnumType.MetaESDT:
          return <NftBlock operationToken={operationNft[0]} value={token.value} />;
        default:
          return null;
      }
    } else {
      return null;
    }
  } else {
    const operationToken = transactionTokens?.esdts.filter((operationToken) => {
      return operationToken.identifier === token.token;
    });
    return operationToken?.length ? (
      <TokenBlock operationToken={operationToken[0]} value={token.value} />
    ) : null;
  }
};

const ActionText = ({
  entry,
  transaction,
  transactionTokens,
}: {
  entry: any;
  transaction: TransactionType;
  transactionTokens?: TransactionTokensType;
}) => {
  switch (true) {
    case typeof entry === 'string':
      return <span>{entry.replace('eGLD', 'EGLD')}</span>;

    case Boolean(entry.address):
      return addressIsBech32(entry.address) ? (
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={entry.address} />
          <NetworkLink
            to={urlBuilder.accountDetails(entry.address)}
            data-testid="receiverLink"
            className="trim-wrapper"
          >
            <Trim text={entry.address} />
          </NetworkLink>
        </div>
      ) : (
        ''
      );

    case Boolean(entry.token && entry.token.length > 0):
      const transferTokens = entry.token.map((token: TokenArgumentType, index: number) => {
        return (
          <div key={`tx-${token.identifier}-${index}`}>
            <ActionToken token={token} transactionTokens={transactionTokens} />
            {index < entry.token.length - 1 && (
              <span className="ml-n1 mr-1 d-none d-sm-flex">,</span>
            )}
          </div>
        );
      });
      return transferTokens;

    case Boolean(entry.value):
      return (
        <span>
          <Denominate value={entry.value} />
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
                className="token-icon rounded-circle ml-lg-1 mr-2"
                alt=" "
              />
            ) : (
              <DefaultAvatar className="token-icon rounded-circle ml-lg-1 mr-2" />
            )}
            {entry.providerName}
          </NetworkLink>
        </span>
      );

    default:
      return null;
  }
};

const TransactionAction = ({
  transaction,
  transactionTokens,
}: {
  transaction: TransactionType;
  transactionTokens?: TransactionTokensType;
}) => {
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
          <ActionText
            entry={entry}
            transaction={transaction}
            transactionTokens={transactionTokens}
          />
        </div>
      ))}
    </div>
  );
};
export default TransactionAction;
