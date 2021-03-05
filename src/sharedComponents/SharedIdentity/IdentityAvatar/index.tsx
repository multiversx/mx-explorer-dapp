import * as React from 'react';

interface IdentityAvatarType {
  name?: string;
  avatar?: string;
  identity?: string;
}

const IdentityAvatar = ({ identity }: { identity: IdentityAvatarType }) => {
  return (
    <img
      className={`identity-avatar rounded-circle mr-2 ${!identity.avatar ? 'p-1 bg-light' : ''}`}
      src={identity.avatar ? identity.avatar : require('../../../assets/images/default-avatar.svg')}
      alt={identity.name}
      height="42"
    />
  );
};

export default IdentityAvatar;
