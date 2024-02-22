import { PLACEHOLDER_IMAGE_PATH } from 'appConstants';
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
    <ImageWithFallback
      className='identity-avatar rounded-circle flex-shrink-0 me-2 '
      src={identity.avatar ?? PLACEHOLDER_IMAGE_PATH}
      height='42'
    />
  );
};
