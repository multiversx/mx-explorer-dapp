import classNames from 'classnames';
import { WithClassnameType } from 'types';

export interface HeroDetailItemUIType extends WithClassnameType {
  title?: React.ReactNode;
  titleClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
  value?: React.ReactNode;
}

export const HeroDetailItem = ({
  title,
  className,
  titleClassName,
  contentClassName,
  value,
  children
}: HeroDetailItemUIType) => {
  if (!title || !(children || value)) {
    return null;
  }

  return (
    <div className={classNames('row hero-detail-item', className)}>
      <div
        className={classNames(
          'col-lg-2 font-headings-regular text-neutral-400 title',
          titleClassName
        )}
      >
        {title}
      </div>
      <div className='col-lg-10'>
        <div
          className={classNames('d-flex align-items-center', contentClassName)}
        >
          {children || value}
        </div>
      </div>
    </div>
  );
};
