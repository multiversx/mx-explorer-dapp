import classNames from 'classnames';

import { NATIVE_TOKEN_IDENTIFIER } from 'appConstants';
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

  if (!token?.token) {
    return null;
  }

  if (token.token === NATIVE_TOKEN_IDENTIFIER) {
    return (
      <div className='d-flex align-items-center symbol text-truncate text-neutral-100'>
        <FormatAmount
          value={token.value}
          showLastNonZeroDecimal={showLastNonZeroDecimal}
          showUsdValue={false}
          className='me-1'
        />
      </div>
    );
  }

  return (
    <div className='token-action-block d-contents'>
      {!noValue && token.value && (
        <FormatAmount
          value={token.value}
          showLabel={false}
          showSymbol={false}
          decimals={decimals}
          showLastNonZeroDecimal={showLastNonZeroDecimal}
          showUsdValue={false}
          className='me-1'
        />
      )}
      <NetworkLink
        to={urlBuilder.tokenDetails(token.token)}
        className={classNames('d-flex text-truncate', {
          'side-link': token.svgUrl
        })}
      >
        <div className='d-flex align-items-center symbol text-truncate'>
          {token.svgUrl && (
            <img
              src={token.svgUrl}
              className='side-icon me-1'
              alt=''
              role='presentation'
            />
          )}
          <span className='text-truncate'>{token.ticker}</span>
        </div>
      </NetworkLink>
      {token.valueUSD && (
        <div className='me-1 text-truncate text-neutral-400 ms-1 text-lh-24'>
          (<FormatUSD value={token.valueUSD} usd={1} />)
        </div>
      )}
    </div>
  );
};
