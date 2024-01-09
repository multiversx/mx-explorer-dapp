import classNames from 'classnames';

import { HEROTAG_SUFFIX } from 'appConstants';
import { ReactComponent as IdentityLogo } from 'assets/img/logos/identity.svg';
import { Trim, Overlay } from 'components';
import { formatHerotag } from 'helpers';
import { AccountAssetType, WithClassnameType } from 'types';

export interface AccountNameUIType extends WithClassnameType {
  address: string;
  assets?: AccountAssetType;
}

export const AccountName = ({
  address,
  assets,
  className,
  'data-testid': dataTestId = ''
}: AccountNameUIType) => {
  if (assets && assets.name) {
    const name = formatHerotag(assets.name);
    const description = `${name} (${address})`;

    return (
      <>
        {name.endsWith(HEROTAG_SUFFIX) && (
          <Overlay
            title='Herotag'
            className='herotag'
            tooltipClassName='account-name'
          >
            <IdentityLogo className='herotag-logo' />
          </Overlay>
        )}
        <Overlay title={description} tooltipClassName='account-name'>
          <div
            className={classNames('text-truncate', className)}
            data-testid={dataTestId}
          >
            {name}
          </div>
        </Overlay>
      </>
    );
  }

  return <Trim text={address} className={className} data-testid={dataTestId} />;
};
