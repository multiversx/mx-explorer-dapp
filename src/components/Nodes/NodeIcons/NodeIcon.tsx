import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Overlay } from 'components';
import { WithClassnameType } from 'types';

export interface NodeIconUIType extends WithClassnameType {
  title: string;
  icon: IconProp;
  small?: boolean;
}

export const NodeIcon = ({ title, icon, small, className }: NodeIconUIType) => {
  if (icon && title) {
    return (
      <Overlay title={title} className='node-icon text-neutral-400 '>
        <FontAwesomeIcon
          icon={icon}
          className={classNames(className)}
          size={small ? 'xs' : '1x'}
        />
      </Overlay>
    );
  }

  return null;
};
