import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../context';

interface TestnetLinkType {
  className?: string;
  to: string;
  children: React.ReactNode | string;
}

const TestnetLink = ({ className, to, children }: TestnetLinkType) => {
  const { activeTestnetId } = useGlobalState();

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  return (
    <Link className={className} to={activeTestnetId ? `/${activeTestnetId}${to}` : to}>
      {children}
    </Link>
  );
};

export default TestnetLink;
