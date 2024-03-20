import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSubdomainNetwork } from 'helpers';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';
import { NetworkLinkPropsType } from './types';

export const NetworkLink = ({
  to,
  children,
  preventScrollReset = false,
  'data-testid': dataTestId,
  ...rest
}: NetworkLinkPropsType) => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { subdomainNetwork } = getSubdomainNetwork();

  const prependLink =
    activeNetworkId &&
    activeNetworkId !== defaultNetworkId &&
    !to.includes(activeNetworkId) &&
    !subdomainNetwork;

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  const props = {
    to: prependLink ? `/${activeNetworkId}${to}` : to,
    ...rest
  };

  return (
    <Link
      {...props}
      preventScrollReset={preventScrollReset}
      {...(dataTestId ? { 'data-testid': dataTestId } : {})}
    >
      {children}
    </Link>
  );
};
