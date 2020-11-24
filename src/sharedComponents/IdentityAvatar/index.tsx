import * as React from 'react';
import { IdentityType } from 'context/state';

const IdentityAvatar = ({ identity }: { identity: IdentityType }) => {
  return (
    <img
      className={`identity-avatar rounded-circle mr-2 ${!identity.avatar ? 'p-1 bg-light' : ''}`}
      src={identity.avatar ? identity.avatar : require('../../assets/images/default-avatar.svg')}
      alt={identity.name}
      height="42"
    />
  );
};

export default IdentityAvatar;
