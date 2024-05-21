import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface TopCardUIType extends WithClassnameType {
  title: React.ReactNode;
  size: 'sm' | 'md' | 'lg';
  icon?: string;
  detailsTitle?: React.ReactNode;
  detailsValue?: React.ReactNode;
  detailsRank?: string | number;
  footerTitle?: React.ReactNode;
  footerValue?: React.ReactNode;
}

export const TopCard = ({
  title,
  size,
  icon,
  detailsTitle,
  detailsValue,
  detailsRank,
  footerTitle,
  footerValue,
  className
}: TopCardUIType) => (
  <div className={classNames('top-card', size, className)}>
    <div className='top-card-header'>
      <h4 className='top-card-header-title'>{title}</h4>
      <div className={classNames('top-card-header-icon', { default: !icon })}>
        {icon && (
          <img
            src={icon}
            alt={`${detailsRank ? `#${detailsRank} ` : ''} Logo`}
            className='icon-img'
          />
        )}
      </div>
    </div>
    {Boolean(detailsTitle || detailsValue || detailsRank) && (
      <div className='top-card-body'>
        <div className='d-flex flex-column'>
          {detailsTitle && (
            <div className='top-card-body-title'>{detailsTitle}</div>
          )}
          {detailsValue && (
            <div className='top-card-body-value'>{detailsValue}</div>
          )}
        </div>
        {detailsRank && <div className='top-card-body-rank'>{detailsRank}</div>}
      </div>
    )}
    {Boolean(footerTitle || footerValue) ? (
      <div className='top-card-footer'>
        <div className='d-flex flex-column'>
          {footerTitle && (
            <div className='top-card-footer-title'>{footerTitle}</div>
          )}
          {footerValue && (
            <div className='top-card-footer-value'>{footerValue}</div>
          )}
        </div>
      </div>
    ) : (
      <div>&nbsp;</div>
    )}
  </div>
);
