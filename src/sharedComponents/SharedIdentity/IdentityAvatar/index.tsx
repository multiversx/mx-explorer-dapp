import * as React from 'react';
import { ReactComponent as DefaultAvatar } from 'assets/images/default-avatar.svg';
interface IdentityAvatarType {
  name?: string;
  avatar?: string;
  identity?: string;
}

const IdentityAvatar = ({ identity }: { identity: IdentityAvatarType }) => {
  return (
    <>
      {identity.avatar ? (
        <img
          className={`identity-avatar rounded-circle flex-shrink-0 mr-2 ${
            !identity.avatar ? 'border-0' : ''
          }`}
          src={identity.avatar}
          alt="img"
          height="42"
        />
      ) : (
        <DefaultAvatar
          className="identity-avatar border-0 flex-shrink-0 mr-2"
          style={{ width: '42px', height: '42px' }}
        />
      )}
    </>
  );
};

export default IdentityAvatar;
