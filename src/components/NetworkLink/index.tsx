import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

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

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  const props = {
    to: activeNetworkId ? `/${activeNetworkId}${to}` : to,
    ...rest,
  };

  return <Link {...props}>{children}</Link>;
};
