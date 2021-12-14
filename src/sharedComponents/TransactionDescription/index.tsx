import * as React from 'react';
import { TokenBlock, NftBlock, ScAddressIcon, NetworkLink, Trim } from 'sharedComponents';
import { addressIsBech32, urlBuilder } from 'helpers';
import { TokenArgumentType, TxActionType, OperationsTokensType } from 'helpers/types';
import unwrapper from './unwrapper';

const DescriptionToken = ({
  token,
  operationsTokens,
}: {
  token: TokenArgumentType;
  operationsTokens?: OperationsTokensType;
}) => {
  if (
    token.type &&
    ['MetaESDT', 'SemiFungibleESDT', 'NonFungibleESDT', 'FungibleESDT'].includes(token.type)
  ) {
    const operationNft = operationsTokens?.nfts.filter((operationToken) => {
      return operationToken.identifier === token.identifier.replace('-undefined', '');
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
      return operationToken.identifier === token.identifier.replace('-undefined', '');
    });
    return operationToken?.length ? (
      <TokenBlock operationToken={operationToken[0]} value={token.value} />
    ) : null;
  }
};

const DescriptionText = ({
  entry,
  operationsTokens,
}: {
  entry: any;
  operationsTokens?: OperationsTokensType;
}) => {
  switch (true) {
    case typeof entry === 'string':
      return (
        <>
          {addressIsBech32(entry) ? (
            <div className="d-flex align-items-center">
              <ScAddressIcon initiator={entry} />
              <NetworkLink
                to={urlBuilder.accountDetails(entry)}
                data-testid="receiverLink"
                className="trim-wrapper"
              >
                <Trim text={entry} />
              </NetworkLink>
            </div>
          ) : (
            <span className="mr-1">{entry.replace('eGLD', 'EGLD')}</span>
          )}
        </>
      );
    case Array.isArray(entry):
      const transferTokens = entry.map((token: TokenArgumentType, index: number) => (
        <>
          <DescriptionToken token={token} operationsTokens={operationsTokens} />
          {index > 0 && <span className="ml-n1 mr-1">,</span>}
        </>
      ));
      return transferTokens;
    default:
      return <DescriptionToken token={entry} operationsTokens={operationsTokens} />;
  }
};

const Description = ({
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
          <DescriptionText entry={entry} operationsTokens={operationsTokens} />
        </div>
      ))}
    </div>
  );
};
export default Description;
