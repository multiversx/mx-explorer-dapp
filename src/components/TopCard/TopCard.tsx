import classNames from 'classnames';

import { NetworkLink } from 'components';
import { WithClassnameType } from 'types';

export interface TopCardUIType extends WithClassnameType {
  title: string | React.ReactNode;
  size: 'sm' | 'md' | 'lg';
  link?: string;
  icon?: string;
  detailsTitle?: string;
  detailsValue?: string;
  detailsRank?: string | number;
  footerTitle?: string;
  footerValue?: string;
}

export const TopCard = ({
  title,
  size,
  link,
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
      <h4 className='top-card-header-title'>
        {link ? (
          <NetworkLink to={link} className='trim-wrapper'>
            {title}
          </NetworkLink>
        ) : (
          <>{title}</>
        )}
      </h4>
      {icon && <img src={icon} alt=' ' className='top-card-header-icon' />}
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
