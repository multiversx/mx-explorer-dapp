import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

interface NetworkLinkType {
  className?: string;
  title?: string;
  onClick?: () => void;
  to: string;
  'data-testid'?: string;
  children: React.ReactNode | string;
}

export const NetworkLink = ({ to, children, ...rest }: NetworkLinkType) => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  const prependLink =
    activeNetworkId && activeNetworkId !== defaultNetworkId && !to.includes(activeNetworkId);

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  const props = {
    to: prependLink ? `/${activeNetworkId}${to}` : to,
    ...rest,
  };

  return <Link {...props}>{children}</Link>;
};
