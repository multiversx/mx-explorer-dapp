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
    const description = `${assets.name} (${address}) ${
      assets.description ? `(${assets.description})` : ''
    }`;
    return (
      <Overlay title={description}>
        <Trim
          text={assets.name}
          {...(dataTestId
            ? {
                dataTestId,
              }
            : {})}
        />
      </Overlay>
    );
  }

  return (
    <Trim
      text={address}
      {...(dataTestId
        ? {
            dataTestId,
          }
        : {})}
    />
  );
};

export default AccountName;
