import { useState } from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';

import { useGetExplorerTitle } from 'hooks';
import { WithClassnameType } from 'types';
import { StatsCard, SmallStatsCard, StatsCardUIType } from 'widgets';

import { HeroDetailItem } from './components/HeroDetailItem';
import { VerifiedBadge } from './components/VerifiedBadge';

export interface HeroDetailsItemsType {
  title?: string;
  value?: React.ReactNode;
}

export interface SEODetailsType {
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
  isVerified?: boolean;
  verifiedComponent?: React.ReactNode;
  description?: string;
  descriptionContent?: React.ReactNode;
  detailItems?: HeroDetailsItemsType[];
  statsCards?: StatsCardUIType[];
  smallStatsCards?: StatsCardUIType[];
  seoDetails?: SEODetailsType;
  'data-testid-prefix'?: string;
}

export const HeroDetailsCard = ({
  title,
  titleContent,
  icon,
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const explorerTitle = useGetExplorerTitle();
  const seoTitle = `${
    seoDetails?.title ?? typeof title === 'string' ? title : ''
  }${
    seoDetails?.title !== seoDetails?.details ? ` (${seoDetails?.details})` : ''
  } ${seoDetails?.text ?? ''}`;
  const seoDescription =
    seoDetails?.description ?? typeof description === 'string'
      ? String(description)
      : '';
  const hasStatCards = statsCards.length > 0 || smallStatsCards.length > 0;

  return (
    <>
      {seoDetails && (
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
            {icon && (
              <img
                src={icon}
                className={classNames(
                  'hero-details-card-logo border d-none d-md-flex col-md-3',
                  { loading: !imageLoaded }
                )}
                alt=' '
                onLoad={() => {
                  setImageLoaded(true);
                }}
              />
            )}
            <div className='hero-details-card-overview d-flex flex-column flex-fill col-9'>
              {title && (
                <div
                  className={classNames('hero-details-card-title', {
                    'mb-spacer': !Boolean(description || descriptionContent)
                  })}
                >
                  <h1 className='mb-0' data-testid={`${testIdPrefix}title`}>
                    {icon && (
                      <img
                        src={icon}
                        className={classNames(
                          'hero-details-card-logo border d-md-none',
                          { loading: !imageLoaded }
                        )}
                        alt=' '
                        onLoad={() => {
                          setImageLoaded(true);
                        }}
                      />
                    )}
                    {title}{' '}
                    {isVerified && (
                      <>{verifiedComponent ?? <VerifiedBadge />}</>
                    )}
                  </h1>
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
                {detailItems.map(({ title, value }, index) => (
                  <HeroDetailItem title={title} key={`${title}-${index}`}>
                    {value}
                  </HeroDetailItem>
                ))}
              </div>
            </div>
          </div>
          {hasStatCards && (
            <div className='hero-details-card-cards d-flex flex-wrap gap-3 mt-5'>
              {statsCards.map(({ title, ...rest }, index) => (
                <StatsCard title={title} key={`${title}-${index}`} {...rest} />
              ))}
              {smallStatsCards.length > 0 && (
                <div className='d-flex flex-column gap-3 small-stats-cards-container'>
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
