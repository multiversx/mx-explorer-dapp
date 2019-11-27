import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../context';

interface TestnetLinkType {
  className?: string;
  title?: string;
  onClick?: () => void;
  to: string;
  'data-testid'?: string;
  children: React.ReactNode | string;
}

const TestnetLink = ({ to, children, ...rest }: TestnetLinkType) => {
  const { activeTestnetId } = useGlobalState();

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  const props = {
    to: activeTestnetId ? `/${activeTestnetId}${to}` : to,
    ...rest,
  };

  return <Link {...props}>{children}</Link>;
};

export default TestnetLink;
