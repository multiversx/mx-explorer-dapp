import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import { PLACEHOLDER_IMAGE_PATH } from 'appConstants';
import {
  Trim,
  PercentageLed,
  NetworkLink,
  ImageWithFallback,
  Overlay
} from 'components';
import {
  getPercentage,
  stringIsFloat,
  urlBuilder,
  getValidLink
} from 'helpers';
import { faExternalLink, faLeaf, faReceipt, faInfinity } from 'icons/regular';
import { faBadgeCheck } from 'icons/solid';
import { ProviderType } from 'types';

const minDelegation = '1000000000000000000';

export const ProviderDetails = ({ provider }: { provider: ProviderType }) => {
  if (!provider) {
    return null;
  }

  const websiteLink = getValidLink({
    link: provider?.identityInfo?.website
  });

  return provider ? (
    <div className='provider-details'>
      <div className='d-flex flex-row align-items-center'>
        <ImageWithFallback
          className='provider-image rounded-circle d-flex me-3 '
          src={provider?.identityInfo?.avatar ?? PLACEHOLDER_IMAGE_PATH}
          alt={provider?.identityInfo?.name ?? provider.provider}
          height='42'
        />
        <div className='d-flex flex-column w-100'>
          <div className='font-headings d-flex align-items-center'>
            <NetworkLink
              to={urlBuilder.providerDetails(provider.provider)}
              className='provider-title'
            >
              {provider?.identityInfo?.name ? (
                <div className='text-truncate'>
                  {provider.identityInfo.name}
                </div>
              ) : (
                <Trim text={provider.provider} />
              )}
            </NetworkLink>
            {provider.featured && (
              <Overlay title=' Verified'>
                <FontAwesomeIcon
                  icon={faBadgeCheck}
                  size='lg'
                  className='ms-2 text-primary'
                />
              </Overlay>
            )}
          </div>

          {websiteLink && (
            <a
              href={websiteLink}
              rel='noopener noreferrer nofollow'
              target='_blank'
              className='provider-website text-neutral-400 d-inline-flex align-items-center'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {websiteLink}
              <FontAwesomeIcon
                size='xs'
                icon={faExternalLink}
                style={{ pointerEvents: 'none' }}
                className='ms-1 text-muted'
              />
            </a>
          )}

          <div className='d-flex flex-wrap provider-metrics'>
            <div>
              <FontAwesomeIcon size='xs' icon={faLeaf} className='me-1' />
              {provider.apr}%<span className='text-neutral-400 ms-1'>APR</span>
            </div>
            <div>
              <FontAwesomeIcon size='xs' icon={faReceipt} className='me-1' />
              {new BigNumber(provider.serviceFee).times(100).toFormat()}%
              <span className='text-neutral-400 ms-1'>Fee</span>
            </div>
            <div>
              {stringIsFloat(provider.locked) &&
              provider.locked !== '0' &&
              stringIsFloat(provider.delegationCap) &&
              provider.delegationCap !== '0' ? (
                <>
                  <PercentageLed
                    percentage={getPercentage({
                      amountOutOfTotal: provider.locked,
                      total: provider.delegationCap,
                      minDelegation
                    })}
                  />
                  <span>
                    {getPercentage({
                      amountOutOfTotal: provider.locked,
                      total: provider.delegationCap,
                      minDelegation
                    })}
                    %<span className='text-neutral-400 ms-1'>Filled</span>
                  </span>
                </>
              ) : (
                <span>
                  <FontAwesomeIcon
                    size='xs'
                    icon={faInfinity}
                    className='me-1'
                  />
                  Uncapped
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
