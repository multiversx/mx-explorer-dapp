import { WithClassnameType } from 'types';

export interface StatsCardType extends WithClassnameType {
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
}

export const StatsCard = ({
  title,
  subTitle,
  value,
  icon,
  className,
  children
}: StatsCardType) => {
  return (
    <div className={`card d-flex flex-grow-1 ${className ?? ''}`}>
      <div className='card-body p-4'>
        {title && (
          <p className='text-neutral-500 mb-0 stats-card-title font-regular'>
            {title}
          </p>
        )}

        {value && (
          <h2 className='stats-card-value mb-0 text-primary'>{value}</h2>
        )}
        {subTitle && (
          <p className='text-primary-200 mb-0 stats-card-title mt-2'>
            {icon}
            <span className='mx-1'>{subTitle}</span>
          </p>
        )}

        {children && <p className='mb-0 mt-2 text-primary-200'>{children}</p>}
      </div>
    </div>
  );
};
