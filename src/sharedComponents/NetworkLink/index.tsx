import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../context';

interface NetworkLinkType {
  className?: string;
  title?: string;
  onClick?: () => void;
  to: string;
  'data-testid'?: string;
  children: React.ReactNode | string;
}

const NetworkLink = ({ to, children, ...rest }: NetworkLinkType) => {
  const { activeNetworkId } = useGlobalState();

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

export default NetworkLink;
