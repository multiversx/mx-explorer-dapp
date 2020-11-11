import * as React from 'react';
import { IdentityType } from 'context/state';

const IdentityIcon = ({ identity }: { identity: IdentityType }) => {
  return (
    <img
      className={`identity-icon rounded-circle mr-2 ${!identity.avatar ? 'p-1 bg-light' : ''}`}
      src={identity.avatar ? identity.avatar : require('../../../assets/images/default-avatar.svg')}
      alt={identity.name}
      height="42"
    />
  );
};

export default IdentityIcon;
