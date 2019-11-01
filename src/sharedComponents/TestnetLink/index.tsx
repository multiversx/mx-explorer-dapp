import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../context';

interface TestnetLinkType {
  className?: string;
  title?: string;
  to: string;
  children: React.ReactNode | string;
}

const TestnetLink = ({ className, to, children, title }: TestnetLinkType) => {
  const { activeTestnetId } = useGlobalState();

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  const props = {
    className,
    to: activeTestnetId ? `/${activeTestnetId}${to}` : to,
    ...(title ? { title } : {}),
  };

  return <Link {...props}>{children}</Link>;
};

export default TestnetLink;
