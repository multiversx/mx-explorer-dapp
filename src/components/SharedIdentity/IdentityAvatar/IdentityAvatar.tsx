import classNames from 'classnames';

import { PLACEHOLDER_IMAGE_PATH } from 'appConstants';
import { ImageWithFallback, Overlay } from 'components';
import { IdentityType, WithClassnameType } from 'types';

export interface IdentityAvatarUIType extends WithClassnameType {
  identity?: IdentityType;
  showTooltip?: boolean;
}

export const IdentityAvatar = ({
  identity,
  showTooltip,
  className
}: IdentityAvatarUIType) => {
  if (showTooltip && identity?.name) {
    return (
      <Overlay
        title={
          <div>
            {identity.name}
            {identity?.description && (
              <p className='mb-0 mt-1'>{identity.description}</p>
            )}
          </div>
        }
        tooltipClassName='text-start'
      >
        <ImageWithFallback
          className={classNames(
            'identity-avatar rounded-circle flex-shrink-0',
            className
          )}
          src={identity?.avatar ?? PLACEHOLDER_IMAGE_PATH}
        />
      </Overlay>
    );
  }
  return (
    <ImageWithFallback
      className={classNames(
        'identity-avatar rounded-circle flex-shrink-0',
        className
      )}
      src={identity?.avatar ?? PLACEHOLDER_IMAGE_PATH}
    />
  );
};
