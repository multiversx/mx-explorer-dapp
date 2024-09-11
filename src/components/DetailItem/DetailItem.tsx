import classNames from 'classnames';
import { WithClassnameType } from 'types';

export interface DetailItemUIType extends WithClassnameType {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  colWidth?: string;
  noBorder?: boolean;
  verticalCenter?: boolean;
}

export const DetailItem = ({
  children,
  title,
  className = '',
  colWidth = '2',
  noBorder = false,
  verticalCenter = false
}: DetailItemUIType) => {
  if (!title && !children) {
    return null;
  }

  return (
    <div
      className={classNames(
        'row detail-item',
        {
          'pt-3 pb-1': noBorder
        },
        { 'border-bottom py-3': !noBorder },
        className
      )}
    >
      <div
        className={classNames(
          `col-lg-${colWidth} text-lg-end text-neutral-400`,
          {
            'd-flex align-items-center justify-content-lg-end': verticalCenter
          }
        )}
      >
        {title}
      </div>
      {children && (
        <div className={`col-lg-${12 - Number(colWidth)} pe-lg-spacer`}>
          {children}
        </div>
      )}
    </div>
  );
};
