import { ReactNode } from 'react';

import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { TokenAssetType } from 'types';

interface SearchTokenRowType {
  identifier: string;
  name?: string;
  ticker?: string;
  assets?: TokenAssetType;
  children?: ReactNode;
}

export const SearchTokenRow = ({
  identifier,
  name,
  ticker,
  assets,
  children
}: SearchTokenRowType) => {
  return (
    <NetworkLink
      to={urlBuilder.tokenDetails(identifier)}
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
                  {name} ({ticker})
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
