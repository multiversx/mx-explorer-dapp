import BigNumber from 'bignumber.js';

import { FormatAmount, NetworkLink, NftBadge, Overlay } from 'components';
import { urlBuilder } from 'helpers';
import { NftTypeEnum, TransactionTokenArgumentType } from 'types';

export const TransactionActionNft = ({
  token,
  transactionActionValue,
  showBadge,
  noValue,
  showLastNonZeroDecimal
}: {
  token: TransactionTokenArgumentType;
  showBadge?: boolean;
  transactionActionValue?: number;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  const displayIdentifier =
    token?.identifier && token.ticker === token.collection
      ? token.identifier
      : token.ticker;

  const tokenValue =
    token?.value !== undefined
      ? token.value
      : transactionActionValue !== undefined
      ? transactionActionValue
      : undefined;

  const TokenInfo = () => (
    <div className='d-flex align-items-center symbol text-truncate'>
      {token.svgUrl && (
        <img
          src={token.svgUrl}
          className='side-icon me-1'
          alt=''
          role='presentation'
        />
      )}
      <span className='text-truncate'>{displayIdentifier}</span>
    </div>
  );

  return (
    <div className='nft-action-block d-contents'>
      {token && (
        <>
          {showBadge && token.type !== NftTypeEnum.MetaESDT && (
            <NftBadge type={token.type} className='me-1 my-auto' />
          )}
          {!noValue && token.type !== NftTypeEnum.NonFungibleESDT && (
            <div className={`me-1  ${token.svgUrl ? 'text-truncate' : ''}`}>
              {token.decimals !== undefined && tokenValue !== undefined ? (
                <FormatAmount
                  value={String(tokenValue)}
                  showLabel={false}
                  showSymbol={false}
                  decimals={token.decimals}
                  showLastNonZeroDecimal={showLastNonZeroDecimal}
                />
              ) : (
                <>
                  {tokenValue &&
                    Number(tokenValue).toLocaleString('en') !== '∞' && (
                      <span className='badge badge-orange'>
                        {new BigNumber(tokenValue).toFormat()}
                      </span>
                    )}
                </>
              )}
            </div>
          )}
          {token.identifier ? (
            <NetworkLink
              to={
                token.type === NftTypeEnum.MetaESDT && token?.collection
                  ? urlBuilder.tokenMetaEsdtDetails(token.collection)
                  : urlBuilder.nftDetails(token.identifier)
              }
              className={`d-flex text-truncate ${
                token.svgUrl ? 'side-link' : ''
              }`}
              {...(token.type === NftTypeEnum.MetaESDT
                ? { 'aria-label': token.identifier }
                : {})}
            >
              {token.type === NftTypeEnum.MetaESDT && token?.svgUrl ? (
                <Overlay title={token.identifier} truncate>
                  <TokenInfo />
                </Overlay>
              ) : (
                <TokenInfo />
              )}
            </NetworkLink>
          ) : (
            <TokenInfo />
          )}
        </>
      )}
    </div>
  );
};
