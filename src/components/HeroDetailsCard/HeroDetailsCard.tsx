import { useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { ImageWithFallback } from 'components';
import { useIsMainnet } from 'hooks';
import { setMetaTags } from 'redux/slices/metaTags';
import { WithClassnameType } from 'types';
import { StatsCard, SmallStatsCard, StatsCardUIType } from 'widgets';

import {
  HeroDetailItem,
  HeroDetailItemUIType
} from './components/HeroDetailItem';
import { VerifiedBadge } from './components/VerifiedBadge';

export interface SEODetailsType {
  completeDetails?: boolean;
  title?: string;
  description?: string;
  icon?: string;
}

export interface HeroDetailsCardUIType extends WithClassnameType {
  title?: React.ReactNode;
  titleContent?: React.ReactNode;
  icon?: string;
  iconComponent?: React.ReactNode;
  iconPlaceholder?: React.ReactNode;
  isVerified?: boolean;
  verifiedComponent?: React.ReactNode;
  description?: string;
  descriptionContent?: React.ReactNode;
  detailItems?: HeroDetailItemUIType[];
  statsCards?: StatsCardUIType[];
  smallStatsCards?: StatsCardUIType[];
  seoDetails?: SEODetailsType;
  'data-testid-prefix'?: string;
}

export const HeroDetailsCard = ({
  title,
  titleContent,
  icon,
  iconComponent,
  iconPlaceholder,
  isVerified,
  verifiedComponent,
  description,
  descriptionContent,
  detailItems = [],
  statsCards = [],
  smallStatsCards = [],
  seoDetails,
  className,
  'data-testid-prefix': testIdPrefix = ''
}: HeroDetailsCardUIType) => {
  const dispatch = useDispatch();
  const isMainnet = useIsMainnet();
  const hasStatCards = statsCards.length > 0 || smallStatsCards.length > 0;
  const hasIcon = Boolean(icon || iconPlaceholder || iconComponent);

  useEffect(() => {
    if (seoDetails?.completeDetails && isMainnet) {
      setTimeout(() => {
        dispatch(
          setMetaTags({
            pageDetails: seoDetails?.title,
            description: seoDetails?.description
          })
        );
      });
    }
  }, [seoDetails, isMainnet]);

  const Icon = ({ className }: WithClassnameType) => (
    <span
      className={classNames('hero-details-card-logo', className, {
        'default-image': !icon && !iconComponent,
        'has-placeholder': !icon && iconPlaceholder,
        'icon-component': !icon && !iconPlaceholder && iconComponent
      })}
    >
      {hasIcon && <>{iconComponent}</>}
    </span>
  );

  return (
    <div
      className={classNames(
        'hero-details-card card card-black mb-3',
        className
      )}
    >
      <div className='card-body'>
        <div
          className={classNames('hero-details-card-content d-flex gap-spacer', {
            'mb-3': !hasStatCards
          })}
        >
          <Icon className='d-none d-md-flex col-md-3' />

          <div className='hero-details-card-overview d-flex flex-column flex-fill col-9'>
            {title && (
              <div
                className={classNames('hero-details-card-title text-break', {
                  'mb-3 mb-md-spacer': !Boolean(
                    description || descriptionContent
                  )
                })}
              >
                <div className='d-flex align-items-center'>
                  <Icon className='d-md-none' />
                  <h1
                    className={classNames('mb-0', {
                      'has-content': Boolean(titleContent || isVerified)
                    })}
                    data-testid={`${testIdPrefix}title`}
                  >
                    <span className='title-container'>{title}</span>
                    {isVerified && (
                      <> {verifiedComponent ?? <VerifiedBadge />}</>
                    )}
                  </h1>
                </div>
                {titleContent}
              </div>
            )}
            {descriptionContent}
            {description && (
              <p
                className='hero-details-card-description text-neutral-400'
                data-testid={`${testIdPrefix}description`}
                title={description}
              >
                {description}
              </p>
            )}
            <div className='d-flex flex-column flex-fill detail-items-container'>
              {detailItems.map(({ title, value, ...props }, index) => (
                <HeroDetailItem
                  title={title}
                  key={`${title}-${index}`}
                  {...props}
                >
                  {value}
                </HeroDetailItem>
              ))}
            </div>
          </div>
        </div>
        {hasStatCards && (
          <div className='hero-details-card-cards d-flex flex-wrap gap-3'>
            {statsCards.map(({ title, ...rest }, index) => (
              <StatsCard title={title} key={`${title}-${index}`} {...rest} />
            ))}
            {smallStatsCards.length > 0 && (
              <div className='d-flex flex-column gap-3 small-stats-cards-container text-break'>
                {smallStatsCards.map(({ title, ...rest }, index) => (
                  <SmallStatsCard
                    title={title}
                    key={`${title}-${index}`}
                    {...rest}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
