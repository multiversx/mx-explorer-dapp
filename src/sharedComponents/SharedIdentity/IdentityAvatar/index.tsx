import * as React from 'react';

interface IdentityAvatarType {
  name?: string;
  avatar?: string;
  identity?: string;
}

const IdentityAvatar = ({ identity }: { identity: IdentityAvatarType }) => {
  return (
    <img
      className={`identity-avatar rounded-circle flex-shrink-0 mr-2 ${
        !identity.avatar ? 'border-0' : ''
      }`}
      src={identity.avatar ? identity.avatar : require('../../../assets/images/default-avatar.svg')}
      alt="img"
      height="42"
    />
  );
};

export default IdentityAvatar;
