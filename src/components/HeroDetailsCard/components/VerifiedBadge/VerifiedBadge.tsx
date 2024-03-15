import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBadgeCheck } from 'icons/solid';

export const VerifiedBadge = () => (
  <div className='verified-badge-wrapper'>
    <div className='verified-badge'>
      <span className='d-none d-md-inline-block me-2'>Verified</span>{' '}
      <FontAwesomeIcon icon={faBadgeCheck} size='sm' />
    </div>
  </div>
);
