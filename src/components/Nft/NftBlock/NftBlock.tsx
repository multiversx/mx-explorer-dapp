import { NetworkLink, FormatAmount } from 'components';
import { isProof, urlBuilder } from 'helpers';
import { NftType, NftTypeEnum } from 'types';

interface NftBlockType {
  operationToken?: NftType;
  value?: string;
}

export const NftBlock = ({ value, operationToken }: NftBlockType) => {
  if (!operationToken) {
    return null;
  }

  const isNftProof = isProof(operationToken);
  const metaDetails = isNftProof
    ? urlBuilder.proofDetails(operationToken?.identifier)
    : urlBuilder.tokenMetaEsdtDetails(operationToken?.collection);

  return (
    <div className='nft-block d-flex text-truncate'>
      {value && operationToken.type !== NftTypeEnum.NonFungibleESDT && (
        <div className='me-1'>
          {operationToken.decimals !== undefined ? (
            <FormatAmount
              value={value}
              showLabel={false}
              showSymbol={false}
              decimals={operationToken.decimals}
              showLastNonZeroDecimal={true}
            />
          ) : (
            Number(value).toLocaleString('en')
          )}
        </div>
      )}
      <NetworkLink
        to={
          operationToken.type === NftTypeEnum.MetaESDT
            ? metaDetails
            : urlBuilder.nftDetails(operationToken.identifier)
        }
        className={`d-flex text-truncate ${
          operationToken?.assets?.svgUrl ? 'side-link' : ''
        }`}
      >
        <div className='d-flex align-items-center symbol text-truncate'>
          {operationToken.assets ? (
            <>
              {operationToken.assets.svgUrl && (
                <img
                  src={operationToken.assets.svgUrl}
                  className='side-icon me-1'
                  alt=''
                  role='presentation'
                />
              )}
              <div className='text-truncate'>
                {operationToken.ticker
                  ? operationToken.ticker
                  : operationToken.name}{' '}
                ({operationToken.identifier})
              </div>
            </>
          ) : (
            <span className='text-truncate'>{operationToken.identifier}</span>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};
