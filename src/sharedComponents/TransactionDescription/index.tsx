import * as React from 'react';
import { TokenBlock, NftBlock } from 'sharedComponents';
import { TokenArgumentType, TxActionType, OperationsTokensType } from 'helpers/types';
import unwrapper from './unwrapper';

const DescriptionToken = ({
  token,
  operationsTokens,
}: {
  token: TokenArgumentType;
  operationsTokens?: OperationsTokensType;
}) => {
  switch (token.type) {
    case 'MetaESDT':
    case 'SemiFungibleESDT':
    case 'NonFungibleESDT':
      const operationNft = operationsTokens?.nfts.filter((operationToken) => {
        return operationToken.identifier === token.identifier.replace('-undefined', '');
      });

      return operationNft?.length ? (
        <NftBlock operationToken={operationNft[0]} value={token.value} />
      ) : null;

    default:
      const operationToken = operationsTokens?.esdts.filter((operationToken) => {
        return operationToken.identifier === token.identifier.replace('-undefined', '');
      });
      return operationToken?.length ? (
        <TokenBlock operationToken={operationToken[0]} value={token.value} />
      ) : null;
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
          {typeof entry === 'string' ? (
            <span className="mr-1">{entry}</span>
          ) : (
            <DescriptionToken token={entry} operationsTokens={operationsTokens} />
          )}
        </div>
      ))}
    </div>
  );
};
export default Description;
