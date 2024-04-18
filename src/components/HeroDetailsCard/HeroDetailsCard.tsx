import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';

import { ImageWithFallback } from 'components';
import { useGetExplorerTitle } from 'hooks';
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
  details?: string;
  description?: string;
  text?: string;
  icon?: string;
}

export interface HeroDetailsCardUIType extends WithClassnameType {
  title?: React.ReactNode;
  titleContent?: React.ReactNode;
  icon?: string;
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
  const explorerTitle = useGetExplorerTitle();
  const seoTitle = `${
    seoDetails?.title ?? (typeof title === 'string' ? title : '')
  }${
    seoDetails?.title !== seoDetails?.details ? ` (${seoDetails?.details})` : ''
  } ${seoDetails?.text ?? ''}`;
  const seoDescription =
    seoDetails?.description ??
    (typeof description === 'string' ? String(description) : '');
  const hasStatCards = statsCards.length > 0 || smallStatsCards.length > 0;
  const hasIcon = Boolean(icon || iconPlaceholder);

  return (
    <>
      {seoDetails?.completeDetails && (
        <Helmet prioritizeSeoTags={true}>
          <title>{`${seoTitle} • MultiversX ${explorerTitle}`}</title>
          {seoDescription && (
            <meta name='description' content={seoDescription} />
          )}
          <meta
            name='twitter:title'
            content={`${seoTitle} • MultiversX ${explorerTitle}`}
          />
          {seoDescription && (
            <meta name='twitter:description' content={seoDescription} />
          )}
          {seoDetails?.icon && (
            <meta name='twitter:image' content={seoDetails.icon} />
          )}
          <meta
            property='og:title'
            content={`${seoTitle} • MultiversX ${explorerTitle}`}
          />
          {seoDescription && (
            <meta property='og:description' content={seoDescription} />
          )}
          {seoDetails?.icon && (
            <meta property='og:image' content={seoDetails.icon} />
          )}
        </Helmet>
      )}
      {seoDetails && !seoDetails.completeDetails && (
        <Helmet prioritizeSeoTags={true}>
          <title>{`${seoTitle} • MultiversX ${explorerTitle}`}</title>
        </Helmet>
      )}
      <div
        className={classNames(
          'hero-details-card card card-black mb-3',
          className
        )}
      >
        <div className='card-body'>
          <div
            className={classNames(
              'hero-details-card-content d-flex gap-spacer',
              { 'mb-3': !hasStatCards }
            )}
          >
            <span
              className={classNames(
                'hero-details-card-logo d-none d-md-flex col-md-3',
                {
                  'default-image': !icon,
                  'has-placeholder': !icon && iconPlaceholder
                }
              )}
            >
              {hasIcon && (
                <>
                  {icon ? (
                    <ImageWithFallback
                      src={icon}
                      className='logo-img'
                      alt={seoTitle ? `${seoTitle} Logo` : 'Logo'}
                    />
                  ) : (
                    iconPlaceholder
                  )}
                </>
              )}
            </span>
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
                    <span
                      className={classNames(
                        'hero-details-card-logo d-md-none',
                        {
                          'default-image': !icon,
                          'has-placeholder': !icon && iconPlaceholder
                        }
                      )}
                    >
                      {hasIcon && (
                        <>
                          {icon ? (
                            <ImageWithFallback
                              src={icon}
                              className='logo-img'
                              alt={seoTitle ? `${seoTitle} Logo` : 'Logo'}
                            />
                          ) : (
                            iconPlaceholder
                          )}
                        </>
                      )}
                    </span>
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
    </>
  );
};
