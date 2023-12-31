import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { Trim, PercentageLed, NetworkLink } from 'components';
import { getPercentage, stringIsFloat, urlBuilder } from 'helpers';
import { faExternalLink, faLeaf, faReceipt, faInfinity } from 'icons/regular';
import { faBadgeCheck } from 'icons/solid';
import { ProviderType } from 'types';
import { ProviderImage } from './ProviderImage';

const minDelegation = '1000000000000000000';

export const ProviderDetails = ({ provider }: { provider: ProviderType }) => {
  return provider ? (
    <div className='provider-details'>
      <div className='d-flex flex-row align-items-center'>
        <ProviderImage provider={provider} />
        <div className='d-flex flex-column w-100'>
          <div className='font-primary-medium d-flex align-items-center'>
            <NetworkLink
              to={urlBuilder.providerDetails(provider.provider)}
              className='provider-title'
            >
              {provider?.identityDetails?.name ? (
                <div className='text-truncate'>
                  {provider.identityDetails.name}
                </div>
              ) : (
                <Trim text={provider.provider} />
              )}
            </NetworkLink>

            {provider.featured && (
              <OverlayTrigger
                placement='top'
                delay={{ show: 0, hide: 400 }}
                overlay={(props: any) => (
                  <Tooltip {...props} show={props.show.toString()}>
                    Verified
                  </Tooltip>
                )}
              >
                <FontAwesomeIcon
                  icon={faBadgeCheck}
                  size='lg'
                  className='ms-2 text-primary'
                />
              </OverlayTrigger>
            )}
          </div>

          {provider?.identityDetails?.website && (
            <a
              href={provider.identityDetails.website.replace(
                'http://',
                'https://'
              )}
              rel='noopener noreferrer nofollow'
              target='_blank'
              className='provider-website text-neutral-400 d-inline-flex align-items-center'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {provider.identityDetails.website.replace('http://', 'https://')}
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
