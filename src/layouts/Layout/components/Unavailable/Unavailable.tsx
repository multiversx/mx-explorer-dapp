import { useSelector } from 'react-redux';
import { PageState } from 'components';
import { faBan, faWifiSlash } from 'icons/regular';
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

  return <PageState icon={icon} title={title} isError />;
};
