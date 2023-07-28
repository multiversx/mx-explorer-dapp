import React from 'react';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faWifiSlash } from '@fortawesome/pro-regular-svg-icons/faWifiSlash';
import { useSelector } from 'react-redux';
import { PageState } from 'components';

import { activeNetworkSelector } from 'redux/selectors';

export const Unavailable = () => {
  const { name, default: defaultNetwork } = useSelector(activeNetworkSelector);

  let icon = faBan;
  let title;
  switch (true) {
    case !window.navigator.onLine:
      title = 'No internet connection';
      icon = faWifiSlash;
      break;
    default:
      title = defaultNetwork
        ? 'There was an internal website error. Please try again later.'
        : `${name} network unavialable.`;

      break;
  }

  return (
    <PageState
      icon={icon}
      title={title}
      className='py-spacer m-auto'
      data-testid='errorScreen'
    />
  );
};
