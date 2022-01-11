import * as React from 'react';
import {
  TokenBlock,
  NftBlock,
  ScAddressIcon,
  NetworkLink,
  Trim,
  Denominate,
} from 'sharedComponents';
import { addressIsBech32, urlBuilder } from 'helpers';
import { TokenArgumentType, TxActionType, OperationsTokensType } from 'helpers/types';
import unwrapper from './unwrapper';

const ActionToken = ({
  token,
  operationsTokens,
}: {
  token: TokenArgumentType;
  operationsTokens?: OperationsTokensType;
}) => {
  if (token.type && ['MetaESDT', 'SemiFungibleESDT', 'NonFungibleESDT'].includes(token.type)) {
    const operationNft = operationsTokens?.nfts.filter((operationToken) => {
      return operationToken.identifier === token.identifier;
    });

    return operationNft?.length ? (
      <div className="d-flex text-truncate">
        {['SemiFungibleESDT', 'NonFungibleESDT'].includes(token.type) ? (
          <span className="mr-1">{token.type === 'NonFungibleESDT' ? 'NFT' : 'SFT'}</span>
        ) : null}
        <NftBlock operationToken={operationNft[0]} value={token.value} />
      </div>
    ) : null;
  } else {
    const operationToken = operationsTokens?.esdts.filter((operationToken) => {
      return operationToken.identifier === token.token;
    });
    return operationToken?.length ? (
      <TokenBlock operationToken={operationToken[0]} value={token.value} />
    ) : null;
  }
};

const ActionText = ({
  entry,
  operationsTokens,
}: {
  entry: any;
  operationsTokens?: OperationsTokensType;
}) => {
  switch (true) {
    case typeof entry === 'string':
      return <span className="mr-1">{entry.replace('eGLD', 'EGLD')}</span>;

    case Boolean(entry.address):
      return (
        <>
          {addressIsBech32(entry.address) ? (
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
          )}
        </>
      );

    case Boolean(entry.token && entry.token.length > 0):
      const transferTokens = entry.token.map((token: TokenArgumentType, index: number) => {
        return (
          <div key={`tx-${token.identifier}-${index}`}>
            <ActionToken token={token} operationsTokens={operationsTokens} />
            {index > 0 && <span className="ml-n1 mr-1">,</span>}
          </div>
        );
      });
      return transferTokens;

    case Boolean(entry.value):
      return <Denominate value={entry.value} />;

    case Boolean(entry.providerName):
      return <span className="mr-1">{entry.providerName}</span>;

    default:
      return null;
  }
};

const TransactionAction = ({
  action,
  operationsTokens,
}: {
  action: TxActionType;
  operationsTokens?: OperationsTokensType;
}) => {
  const [unwrappedResult, setUnwrappedResult] = React.useState<ReturnType<typeof unwrapper>>([]);

  React.useEffect(() => {
    const result = unwrapper(action);
    setUnwrappedResult(result);
  }, [action]);

  return (
    <div className="d-flex flex-column flex-lg-row">
      {unwrappedResult.map((entry, i) => (
        <div
          key={JSON.stringify(unwrappedResult) + i}
          className={`${i > 0 && entry !== 'string' ? 'mr-1' : ''}`}
        >
          <ActionText entry={entry} operationsTokens={operationsTokens} />
        </div>
      ))}
    </div>
  );
};
export default TransactionAction;
