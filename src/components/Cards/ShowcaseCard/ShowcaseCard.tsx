import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface ShowcaseCardUIType extends WithClassnameType {
  title: React.ReactNode;
  icon?: string;
  detailsTitle?: React.ReactNode;
  detailsValue?: React.ReactNode;
  detailsRank?: string | number;
  footerTitle?: React.ReactNode;
  footerValue?: React.ReactNode;
}

export const ShowcaseCard = ({
  title,
  icon,
  detailsTitle,
  detailsValue,
  detailsRank,
  className
}: ShowcaseCardUIType) => (
  <div className={classNames('showcase-card border', className)}>
    <div className='showcase-card-header'>
      {Boolean(detailsTitle || detailsValue || detailsRank) && (
        <>
          {detailsRank && (
            <h2 className='showcase-card-rank mb-0'>{detailsRank}</h2>
          )}
          <div className='d-flex gap-1 text-primary-300 font-headings-regular'>
            {detailsValue && (
              <div className='showcase-card-value'>{detailsValue}</div>
            )}
            {detailsTitle && (
              <div className='showcase-card-details opacity-70'>
                {detailsTitle}
              </div>
            )}
          </div>
        </>
      )}
    </div>
    <div
      className={classNames('showcase-card-icon-container', {
        default: !Boolean(icon)
      })}
    >
      <img
        src={icon ?? 'assets/img/default.svg'}
        alt=' '
        className={classNames('icon-blur-bg img-fluid', {
          default: !Boolean(icon)
        })}
      />
      <img
        src={icon ?? 'assets/img/default.svg'}
        alt={`${detailsRank ? `#${detailsRank} ` : ''} Logo`}
        className={classNames('icon img-fluid', { default: !Boolean(icon) })}
      />
    </div>
    <div className='showcase-card-title'>
      <h3 className='mb-0'>{title}</h3>
    </div>
  </div>
);
