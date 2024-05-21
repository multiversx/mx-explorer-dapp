import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSubdomainNetwork } from 'helpers';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';
import { NetworkLinkUIType } from './types';

export const NetworkLink = ({
  to,
  children,
  preventScrollReset = false,
  'data-testid': dataTestId = '',
  ...rest
}: NetworkLinkUIType) => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { subdomainNetwork } = getSubdomainNetwork();

  if (!to) {
    return (
      <span data-testid={dataTestId} className={rest?.className}>
        {children}
      </span>
    );
  }

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  const prependLink =
    activeNetworkId &&
    activeNetworkId !== defaultNetworkId &&
    !to.startsWith(`/${activeNetworkId}`) &&
    !subdomainNetwork;

  const props = {
    to: prependLink ? `/${activeNetworkId}${to}` : to,
    ...rest
  };

  return (
    <Link
      {...props}
      preventScrollReset={preventScrollReset}
      data-testid={dataTestId}
    >
      {children}
    </Link>
  );
};
