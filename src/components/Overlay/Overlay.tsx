import { useState } from 'react';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { WithClassnameType } from 'types';

const OVERLAY_DELAY = { show: 0, hide: 200 };

export type OverlayTitleType = React.ReactNode | (() => React.ReactNode);

export interface OverlayUIType extends WithClassnameType {
  children?: React.ReactNode;
  title: OverlayTitleType;
  tooltipClassName?: string;
  truncate?: boolean;
  persistent?: boolean;
  style?: any;
}

export const Overlay = ({
  children,
  title,
  className,
  tooltipClassName,
  persistent = false,
  truncate = false,
  style
}: OverlayUIType) => {
  const [show, setShow] = useState(false);
  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };

  return (
    <OverlayTrigger
      placement='top'
      delay={OVERLAY_DELAY}
      overlay={(props: any) => (
        <Tooltip
          {...(tooltipClassName ? { className: tooltipClassName } : {})}
          {...props}
          {...(persistent
            ? {
                onMouseEnter: handleOnMouseEnter,
                onMouseLeave: handleOnMouseLeave
              }
            : { show: props.show.toString() })}
        >
          {typeof title === 'function' ? title() : title}
        </Tooltip>
      )}
      {...(persistent ? { show } : {})}
    >
      <span
        className={classNames(className, 'cursor-context', {
          'text-truncate': truncate
        })}
        {...(style ? { style: style } : {})}
        {...(persistent
          ? {
              onMouseEnter: handleOnMouseEnter,
              onMouseLeave: handleOnMouseLeave
            }
          : {})}
      >
        {children ?? ''}
      </span>
    </OverlayTrigger>
  );
};
