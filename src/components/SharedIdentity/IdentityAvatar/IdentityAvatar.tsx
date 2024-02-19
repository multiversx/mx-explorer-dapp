import { ReactComponent as DefaultAvatar } from 'assets/img/default-avatar.svg';

import { ImageWithFallback } from 'components';

interface IdentityAvatarType {
  name?: string;
  avatar?: string;
  identity?: string;
}

export const IdentityAvatar = ({
  identity
}: {
  identity: IdentityAvatarType;
}) => {
  return (
    <>
      {identity.avatar ? (
        <ImageWithFallback
          className={`identity-avatar rounded-circle flex-shrink-0 me-2 ${
            !identity.avatar ? 'border-0' : ''
          }`}
          src={identity.avatar}
          height='42'
        />
      ) : (
        <DefaultAvatar
          className='identity-avatar border-0 flex-shrink-0 me-2'
          style={{ width: '42px', height: '42px' }}
        />
      )}
    </>
  );
};
