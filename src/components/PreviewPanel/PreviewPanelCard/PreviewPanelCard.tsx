import { ReactNode } from 'react';
import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface PreviewPanelCardUIType extends WithClassnameType {
  title?: ReactNode;
  children?: ReactNode;
  featured?: boolean;
  fullWidth?: boolean;
  halfWidth?: boolean;
}

export const PreviewPanelCard = ({
  title,
  children,
  featured,
  fullWidth,
  halfWidth,
  className
}: PreviewPanelCardUIType) => {
  if (!(title || children)) {
    return null;
  }

  return (
    <dl
      className={classNames('preview-panel-card', className, {
        featured: featured,
        'full-width': fullWidth,
        'half-width': halfWidth
      })}
    >
      {title && <dt>{title}</dt>}
      {children && <dd>{children}</dd>}
    </dl>
  );
};
