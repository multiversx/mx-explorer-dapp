import { useEffect, useState } from 'react';

import { HEROTAG_SUFFIX } from 'appConstants';
import IdentityLogo from 'assets/img/logos/identity.svg';
import { Trim, Overlay } from 'components';
import { formatHerotag } from 'helpers';
import { useAdapter } from 'hooks';
import { AccountAssetType, WithClassnameType } from 'types';

export interface AccountNameUIType extends WithClassnameType {
  address: string;
  username?: string;
  assets?: AccountAssetType;
  fetchAssets?: boolean;
}

export const AccountName = ({
  address,
  username,
  assets,
  fetchAssets = false,
  className,
  'data-testid': dataTestId = ''
}: AccountNameUIType) => {
  const { getAccountAssets } = useAdapter();
  const [fetchedAssets, setFetchedAssets] = useState<AccountAssetType>();

  const fetchAccountAssets = () => {
    getAccountAssets({ address }).then(({ success, data }) => {
      if (data && success) {
        setFetchedAssets({
          ...data.assets,
          ...(!data.name && data.username ? { name: data.username } : {})
        });
      }
    });
  };

  useEffect(() => {
    if (address && fetchAssets && !assets) {
      setFetchedAssets(undefined);
      fetchAccountAssets();
    }
  }, [address, fetchAssets, assets]);

  const displayAssets = assets || fetchedAssets;
  const displayName = username || displayAssets?.name;

  if (!address) {
    return '-';
  }

  if (displayName) {
    const name = formatHerotag(displayName);
    const description = `${name} (${address})`;

    return (
      <>
        {displayName.endsWith(HEROTAG_SUFFIX) && (
          <Overlay
            title='Herotag'
            className='herotag'
            tooltipClassName='account-name'
          >
            <IdentityLogo className='herotag-logo' />
          </Overlay>
        )}
        <Overlay
          title={description}
          tooltipClassName='account-name'
          data-testid={dataTestId}
          className={className}
          truncate
        >
          {name}
        </Overlay>
      </>
    );
  }

  return <Trim text={address} className={className} data-testid={dataTestId} />;
};
