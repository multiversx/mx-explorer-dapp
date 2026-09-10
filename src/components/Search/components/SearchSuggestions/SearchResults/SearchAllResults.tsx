import { ReactNode } from 'react';
import { NetworkLink } from 'components';

export const SearchAllResults = ({
  to,
  children
}: {
  to: string;
  children: ReactNode;
}) => {
  return (
    <NetworkLink to={to} className='search-suggestion selectable mb-3'>
      <div className='search-separator'></div>
      <div className='mx-spacer'>{children}</div>
      <div className='search-separator'></div>
    </NetworkLink>
  );
};
