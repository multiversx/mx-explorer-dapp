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
    const name = assets.name.replace(/\p{Emoji}/gu, '');
    const description = `${name} (${address})`;
    return (
      <Overlay title={description}>
        <span
          className={`text-truncate ${color ? `text-${color}` : ''}`}
          {...(dataTestId
            ? {
                dataTestId,
              }
            : {})}
        >
          {name}
        </span>
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
