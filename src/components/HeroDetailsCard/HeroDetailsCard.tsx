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
  useIcon?: boolean;
}

export interface HeroDetailsCardUIType extends WithClassnameType {
  title?: string;
  titleContent?: React.ReactNode;
  iconSvg?: string;
  iconPng?: string;
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
  iconSvg,
  iconPng,
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
  const seoTitle = `${seoDetails?.title ?? title ?? ''}${
    seoDetails?.title !== seoDetails?.details ? ` (${seoDetails?.details})` : ''
  } ${seoDetails?.text ?? ''}`;
  const seoDescriotion = seoDetails?.description ?? description;

  return (
    <>
      {seoDetails && (
        <Helmet prioritizeSeoTags={true}>
          <title>{`${seoTitle} • MultiversX ${explorerTitle}`}</title>
          {seoDescriotion && (
            <meta name='description' content={seoDescriotion} />
          )}
          <meta
            name='twitter:title'
            content={`${seoTitle} • MultiversX ${explorerTitle}`}
          />
          <meta name='twitter:card' content='summary' />
          {seoDescriotion && (
            <meta name='twitter:description' content={seoDescriotion} />
          )}
          {seoDetails?.useIcon && iconPng && (
            <meta name='twitter:image' content={iconPng} />
          )}
          <meta
            property='og:title'
            content={`${seoTitle} • MultiversX ${explorerTitle}`}
          />
          {seoDescriotion && (
            <meta property='og:description' content={seoDescriotion} />
          )}
          {seoDetails?.useIcon && iconPng && (
            <meta property='og:image' content={iconPng} />
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
          <div className='hero-details-card-content d-flex gap-spacer mb-5'>
            {(iconSvg || iconPng) && (
              <img
                src={iconSvg ?? iconPng}
                className='hero-details-card-logo border d-none d-md-flex col-md-3'
                alt=' '
              />
            )}
            <div className='hero-details-card-overview d-flex flex-column flex-fill col-9 gap-3'>
              {title && (
                <div className='hero-details-card-title'>
                  <h1 className='mb-0' data-testid={`${testIdPrefix}title`}>
                    {(iconSvg || iconPng) && (
                      <img
                        src={iconSvg ?? iconPng}
                        className='hero-details-card-logo border d-md-none'
                        alt=' '
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
              {detailItems.map(({ title, value }, index) => (
                <HeroDetailItem title={title} key={`${title}-${index}`}>
                  {value}
                </HeroDetailItem>
              ))}
            </div>
          </div>
          <div className='hero-details-card-cards d-flex flex-wrap gap-3'>
            {statsCards.map(({ title, ...rest }, index) => (
              <StatsCard title={title} key={`${title}-${index}`} {...rest} />
            ))}
            {smallStatsCards.length > 0 && (
              <div className='d-flex flex-column gap-3 flex-fill small-stats-cards-container'>
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
        </div>
      </div>
    </>
  );
};
