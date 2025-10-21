import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { POOLING_REFRESH_RATE_LIMIT } from 'appConstants';
import { faPause, faPlay } from 'icons/regular';
import { activeNetworkSelector } from 'redux/selectors';

export const PauseRefreshButton = ({
  pauseRefresh,
  resumeRefresh,
  isRefreshPaused
}: {
  pauseRefresh: ActionCreatorWithoutPayload;
  resumeRefresh: ActionCreatorWithoutPayload;
  isRefreshPaused?: boolean;
}) => {
  const { refreshRate } = useSelector(activeNetworkSelector);
  const dispatch = useDispatch();

  if (!refreshRate || refreshRate > POOLING_REFRESH_RATE_LIMIT) {
    return null;
  }

  return (
    <button
      type='button'
      className='btn btn-sm btn-dark-alt pause-refresh-button'
      onClick={() =>
        dispatch(isRefreshPaused ? resumeRefresh() : pauseRefresh())
      }
    >
      <FontAwesomeIcon icon={isRefreshPaused ? faPlay : faPause} size='sm' />
    </button>
  );
};
