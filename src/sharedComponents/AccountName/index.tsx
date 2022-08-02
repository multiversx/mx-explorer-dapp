import * as React from 'react';
import { AssetType } from 'helpers/types';
import { Trim, Overlay } from 'sharedComponents';

const AccountName = ({
  address,
  assets,
  dataTestId,
  color,
}: {
  address: string;
  assets?: AssetType;
  dataTestId?: string;
  color?: 'muted' | 'secondary';
}) => {
  if (assets && assets.name) {
    const name = assets.name.replaceAll(/[^\p{L}\p{N}\p{P}\p{Z}\n]/gu, '');
    const description = `${name} (${address})`;
    const dynamicIconColor = assets?.iconSvg && assets.iconSvg.includes('elrond.svg');
    return (
      <Overlay title={description} tooltipClassName={'account-name'}>
        <div className="d-flex align-items-center">
          {assets?.iconSvg && (
            <div className="side-icon mr-1">
              <img
                src={assets?.iconSvg}
                alt=" "
                className={dynamicIconColor ? 'icon-elrond' : ''}
              />
            </div>
          )}
          <div
            className={`text-truncate ${color ? `text-${color}` : ''}`}
            {...(dataTestId
              ? {
                  datatestid: dataTestId,
                }
              : {})}
          >
            {name}
          </div>
        </div>
      </Overlay>
    );
  }

  return (
    <Trim
      text={address}
      color={color}
      {...(dataTestId
        ? {
            dataTestId,
          }
        : {})}
    />
  );
};

export default AccountName;
