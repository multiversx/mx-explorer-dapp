import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Overlay, OverlayUIType } from 'components';
import { faSquareInfo } from 'icons/solid';

export interface InfoTooltipUIType extends OverlayUIType {
  iconClassName?: string;
}

export const InfoTooltip = (props: InfoTooltipUIType) => {
  const { iconClassName, className } = props;

  return (
    <Overlay {...props} className={classNames('side-action ', className)}>
      <FontAwesomeIcon
        icon={faSquareInfo}
        className={classNames(iconClassName)}
      />
    </Overlay>
  );
};
