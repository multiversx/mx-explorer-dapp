import React from 'react';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faWifiSlash } from '@fortawesome/pro-regular-svg-icons/faWifiSlash';
import { PageState } from 'sharedComponents';
import { useGlobalState } from 'context';

const Unavailable = () => {
  const { activeNetwork } = useGlobalState();

  let icon = faBan;
  let title;
  switch (true) {
    case !window.navigator.onLine:
      title = 'No internet connection';
      icon = faWifiSlash;
      break;
    default:
      title = activeNetwork.default
        ? 'There was an internal website error. Please try again later.'
        : `${activeNetwork.name} network unavialable.`;

      break;
  }

  return (
    <PageState icon={icon} title={title} className="py-spacer m-auto" data-testid="errorScreen" />
  );
};

export default Unavailable;
