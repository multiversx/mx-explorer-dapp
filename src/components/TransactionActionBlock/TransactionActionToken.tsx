import { FormatAmount, FormatUSD, NetworkLink } from 'components';
import { DECIMALS } from 'config';
import { urlBuilder } from 'helpers';
import { TransactionTokenArgumentType } from 'types';

export const TransactionActionToken = ({
  token,
  noValue,
  showLastNonZeroDecimal
}: {
  token: TransactionTokenArgumentType;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  const decimals = token.decimals !== undefined ? token.decimals : DECIMALS;

  return (
    <div className='token-action-block d-contents'>
      {token && token.token && (
        <>
          {!noValue && token.value && (
            <div className='me-1 text-truncate'>
              <FormatAmount
                value={token.value}
                showLabel={false}
                showSymbol={false}
                decimals={decimals}
                showLastNonZeroDecimal={showLastNonZeroDecimal}
              />
            </div>
          )}
          <NetworkLink
            to={urlBuilder.tokenDetails(token.token)}
            className={`d-flex text-truncate ${
              token.svgUrl ? 'side-link' : ''
            }`}
          >
            <div className='d-flex align-items-center symbol text-truncate'>
              {token.svgUrl && (
                <img
                  src={token.svgUrl}
                  alt={token.name}
                  className='side-icon me-1'
                />
              )}
              <span className='text-truncate'>{token.ticker}</span>
            </div>
          </NetworkLink>
          {token?.valueUSD && (
            <div className='me-1 text-truncate text-neutral-400 ms-1 text-lh-24'>
              (<FormatUSD value={token.valueUSD} usd={1} />)
            </div>
          )}
        </>
      )}
    </div>
  );
};
