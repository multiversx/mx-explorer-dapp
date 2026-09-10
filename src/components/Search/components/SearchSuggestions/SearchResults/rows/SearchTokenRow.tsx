import { ReactNode } from 'react';

import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { TokenAssetType, TokenTypeEnum } from 'types';

interface SearchTokenRowType {
  identifier: string;
  name?: string;
  ticker?: string;
  assets?: TokenAssetType;
  type?: TokenTypeEnum;
  children?: ReactNode;
}

export const SearchTokenRow = ({
  identifier,
  name,
  ticker,
  assets,
  type = TokenTypeEnum.FungibleESDT,
  children
}: SearchTokenRowType) => {
  return (
    <NetworkLink
      to={
        type === TokenTypeEnum.MetaESDT
          ? urlBuilder.tokenMetaEsdtDetails(identifier)
          : urlBuilder.tokenDetails(identifier)
      }
      className='search-suggestion selectable'
    >
      <div className='search-text trim text-truncate'>
        {assets ? (
          <>
            {assets.svgUrl && (
              <img
                src={assets.svgUrl}
                className='side-icon me-1'
                alt=''
                role='presentation'
              />
            )}
            <div className='text-truncate'>
              {name ? (
                <>
                  {ticker} {name !== ticker && `(${name})`}
                </>
              ) : (
                <>{identifier}</>
              )}
            </div>
          </>
        ) : (
          identifier
        )}
      </div>
      {children}
    </NetworkLink>
  );
};
