import * as React from 'react';
import { TokenArgumentType, TxActionType } from 'helpers/types';
import unwrapper from './unwrapper';

const DescriptionToken = ({ token }: { token: TokenArgumentType }) => {
  const { tokens, nfts, extraEsdts, extraNfts } = useAccount();

  const foundToken =
    token.type === 'FungibleESDT'
      ? [...tokens, ...extraEsdts].find((el) => el.identifier === token.identifier)
      : [...nfts, ...extraNfts].find((el) => el.identifier === token.identifier);

  return (
    <Tokens.TokenElement
      name={token.name}
      identifier={token.identifier}
      balance={token.value}
      denomination={token.decimals}
      isEgld={false}
      avatar={foundToken?.assets?.svgUrl || foundToken?.assets?.pngUrl || ''}
      inTransactionList
    />
  );
};

const Description = ({
  action,
  operationsTokens,
}: {
  action: TxActionType;
  operationsTokens: any;
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
          className={`small ${i > 0 && entry !== 'string' ? 'mx-1' : ''}`}
        >
          {typeof entry === 'string' ? entry : <DescriptionToken token={entry} />}
        </div>
      ))}
    </div>
  );
};
export default Description;
