import * as React from 'react';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import { faCity } from '@fortawesome/pro-regular-svg-icons/faCity';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons/faBadgeCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  Denominate,
  NetworkLink,
  PageState,
  SharedIdentity,
  Trim
} from 'components';
import { urlBuilder } from 'helpers';
import { IdentityType } from 'types';

export const IdentitySummary = ({
  identity,
  featured
}: {
  identity: IdentityType | undefined;
  featured?: boolean;
}) => {
  return (
    <div className='identity-summary card'>
      <div className='card-body px-lg-spacer'>
        {identity !== undefined ? (
          <div className='row'>
            <div className='col'>
              <div className='d-flex flex-column flex-md-row align-items-md-center'>
                <div className='d-flex align-items-center min-w-0 mb-3 mb-md-0'>
                  <SharedIdentity.Avatar identity={identity} />

                  <h5 className='mb-0 ms-2'>
                    {identity.identity ? (
                      <>
                        <NetworkLink
                          to={urlBuilder.identityDetails(identity.identity)}
                        >
                          <span className='truncate-item-xl d-block'>
                            {identity.name ? identity.name : 'N/A'}
                          </span>
                        </NetworkLink>
                        {featured && (
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
                      </>
                    ) : (
                      <>
                        {identity.name ? <Trim text={identity.name} /> : 'N/A'}
                      </>
                    )}
                  </h5>

                  <div className='flex-shrink-0 bg-success text-white btn-sm rounded-pill ms-2'>
                    Rank {identity.rank ? identity.rank : 'N/A'}
                  </div>
                </div>
                <div className='d-none d-md-flex mx-4'>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className='text-muted'
                    size='2x'
                  />
                </div>
                <div className='d-flex align-items-center me-4'>
                  <span className='text-neutral-300 text-nowrap pe-2'>
                    Stake Balance:
                  </span>
                  {identity.locked ? (
                    <Denominate value={identity.locked} />
                  ) : (
                    'N/A'
                  )}
                </div>
                <div className='d-flex align-items-center me-4'>
                  <span className='text-neutral-300 pe-2'>Stake percent:</span>
                  {identity.stakePercent ? (
                    <>
                      {Math.round(identity.stakePercent) > 0
                        ? Math.round(identity.stakePercent)
                        : '< 1'}
                      %
                    </>
                  ) : (
                    'N/A'
                  )}
                </div>
                <div className='d-flex align-items-center'>
                  <span className='text-neutral-300 pe-2'>Nodes:</span>
                  {identity.validators ? identity.validators : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PageState
            icon={faCity}
            title='Unable to load identity details'
            className='py-spacer my-auto page-state-sm'
            dataTestId='errorScreen'
          />
        )}
      </div>
    </div>
  );
};
