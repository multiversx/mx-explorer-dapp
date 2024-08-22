import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface PanelCardUIType extends WithClassnameType {
  title?: React.ReactNode;
  children?: React.ReactNode;
  featured?: boolean;
}

export const PanelCard = ({
  title,
  children,
  featured,
  className
}: PanelCardUIType) => {
  if (!(title || children)) {
    return null;
  }

  return (
    <div
      className={classNames('panel-card', className, { featured: featured })}
    >
      {title && <dt>{title}</dt>}
      {children && <dd>{children}</dd>}
    </div>
  );
};
