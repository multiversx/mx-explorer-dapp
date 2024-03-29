import { FormatAmount, TokenLink } from 'components';
import { DECIMALS } from 'config';
import { TokenType } from 'types';

interface TokenBlockType {
  operationToken: TokenType;
  value?: string;
}

export const TokenBlock = ({ value, operationToken }: TokenBlockType) => {
  const decimals =
    operationToken.decimals !== undefined ? operationToken.decimals : DECIMALS;

  return (
    <div className='token-block d-flex text-truncate'>
      {value && (
        <div className='me-1'>
          <FormatAmount
            value={value}
            decimals={decimals}
            showLabel={false}
            showSymbol={false}
            showLastNonZeroDecimal={true}
          />
        </div>
      )}
      <TokenLink token={operationToken} />
    </div>
  );
};
