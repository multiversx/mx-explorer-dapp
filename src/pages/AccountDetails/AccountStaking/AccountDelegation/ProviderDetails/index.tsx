import * as React from 'react';
import BigNumber from 'bignumber.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink, faLeaf, faReceipt, faInfinity } from '@fortawesome/pro-regular-svg-icons';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { ProviderType } from 'types';
import { getPercentage, stringIsFloat } from 'helpers';
import { Trim, PercentageLed } from 'components';
import { ProviderImage } from './ProviderImage';

const minDelegation = '1000000000000000000';

export const ProviderDetails = ({ provider }: { provider: ProviderType }) => {
  return provider ? (
    <div className="provider-details">
      <div className="d-flex flex-row align-items-center">
        <ProviderImage provider={provider} />
        <div className="d-flex flex-column w-100">
          <div className="provider-title d-flex align-items-center">
            {provider?.identityDetails?.name ? (
              <div className="text-truncate">{provider.identityDetails.name}</div>
            ) : (
              <Trim text={provider.provider} />
            )}

            {provider.featured && (
              <OverlayTrigger
                placement="top"
                delay={{ show: 0, hide: 400 }}
                overlay={(props: any) => (
                  <Tooltip {...props} show={props.show.toString()}>
                    Verified
                  </Tooltip>
                )}
              >
                <FontAwesomeIcon icon={faBadgeCheck} size="lg" className="ml-2 text-primary" />
              </OverlayTrigger>
            )}
          </div>

          {provider?.identityDetails?.website && (
            <a
              href={provider.identityDetails.website.replace('http://', 'https://')}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="provider-website text-secondary d-inline-flex align-items-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {provider.identityDetails.website.replace('http://', 'https://')}
              <FontAwesomeIcon
                size="xs"
                icon={faExternalLink}
                style={{ pointerEvents: 'none' }}
                className="ml-1 text-muted"
              />
            </a>
          )}

          <div className="d-flex flex-wrap provider-metrics">
            <div>
              <FontAwesomeIcon size="xs" icon={faLeaf} className="mr-1" />
              {provider.apr}%<span className="text-secondary ml-1">APR</span>
            </div>
            <div>
              <FontAwesomeIcon size="xs" icon={faReceipt} className="mr-1" />
              {new BigNumber(provider.serviceFee).times(100).toFormat()}%
              <span className="text-secondary ml-1">Fee</span>
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
                      minDelegation,
                    })}
                  />
                  <span>
                    {getPercentage({
                      amountOutOfTotal: provider.locked,
                      total: provider.delegationCap,
                      minDelegation,
                    })}
                    %<span className="text-secondary ml-1">Filled</span>
                  </span>
                </>
              ) : (
                <span>
                  <FontAwesomeIcon size="xs" icon={faInfinity} className="mr-1" />
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
