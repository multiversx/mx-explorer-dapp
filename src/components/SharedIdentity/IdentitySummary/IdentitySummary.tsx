import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  FormatAmount,
  NetworkLink,
  Overlay,
  PageState,
  SharedIdentity,
  Trim
} from 'components';
import { formatPercentLabel, urlBuilder } from 'helpers';
import { faAngleRight, faCity } from 'icons/regular';
import { faBadgeCheck } from 'icons/solid';
import { IdentityType } from 'types';

export const IdentitySummary = ({
  identity,
  featured
}: {
  identity: IdentityType | undefined;
  featured?: boolean;
}) => {
  return (
    <div className='identity-summary card card-black'>
      <div className='card-body'>
        {identity !== undefined ? (
          <div className='row'>
            <div className='col'>
              <div className='d-flex flex-column flex-xxl-row align-items-xxl-center'>
                <div className='d-flex align-items-center min-w-0 mb-3 mb-xxl-0'>
                  <SharedIdentity.Avatar identity={identity} className='me-2' />

                  <h5 className='mb-0 mx-2 d-flex'>
                    {identity.identity ? (
                      <>
                        <NetworkLink
                          to={urlBuilder.identityDetails(identity.identity)}
                        >
                          <span className='truncate-item-xxl d-block'>
                            {identity.name ? identity.name : 'N/A'}
                          </span>
                        </NetworkLink>
                        {featured && (
                          <Overlay title='Verified'>
                            <FontAwesomeIcon
                              icon={faBadgeCheck}
                              size='lg'
                              className='ms-2 text-primary'
                            />
                          </Overlay>
                        )}
                      </>
                    ) : (
                      <>
                        {identity.name ? <Trim text={identity.name} /> : 'N/A'}
                      </>
                    )}
                  </h5>

                  <div className='identity-badge'>
                    Rank{' '}
                    <div className='badge-side'>
                      {identity.rank ? identity.rank : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className='d-none d-xxl-flex mx-2'>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className='text-muted'
                    size='2x'
                  />
                </div>
                <div className='d-flex flex-wrap align-items-center flex-fill gap-3'>
                  <div className='d-flex align-items-center card p-3 flex-grow-1 detail-card stake-detail-card'>
                    <span className='text-neutral-500 text-nowrap'>
                      Stake Balance
                    </span>
                    <h5 className='mb-0'>
                      {identity.locked ? (
                        <FormatAmount value={identity.locked} />
                      ) : (
                        'N/A'
                      )}
                    </h5>
                  </div>
                  <div className='d-flex align-items-center card p-3 flex-grow-1 detail-card'>
                    <span className='text-neutral-500'>Stake percent</span>
                    <h5 className='mb-0'>
                      {formatPercentLabel(identity?.stakePercent)}
                    </h5>
                  </div>
                  <div className='d-flex align-items-center card p-3 flex-grow-1 detail-card'>
                    <span className='text-neutral-500'>Nodes</span>
                    <h5 className='mb-0'>
                      {identity.validators ? identity.validators : 'N/A'}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PageState
            icon={faCity}
            title='Unable to load identity details'
            className='py-spacer my-auto page-state-sm'
            isError
          />
        )}
      </div>
    </div>
  );
};
