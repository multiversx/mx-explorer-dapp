import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from 'context';
import { TestnetLink } from 'sharedComponents';

interface NavLinksType {
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavLinks({ expanded = false, setExpanded = () => null }: NavLinksType) {
  const { activeNetworkId } = useGlobalState();
  const { pathname } = useLocation();

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <>
      <TestnetLink
        className={`nav-link ${
          pathname.toString() === '/' ||
          pathname.toString() === `/${activeNetworkId}` ||
          pathname.toString() === `/${activeNetworkId}/`
            ? 'active'
            : ''
        }`}
        to="/"
        onClick={() => onToggle(false)}
      >
        Dashboard
      </TestnetLink>
      <TestnetLink
        className={`nav-link ${
          pathname.toString().includes('blocks') && !pathname.toString().includes('miniblocks')
            ? 'active'
            : ''
        }`}
        to="/blocks"
        onClick={() => onToggle(false)}
      >
        Blocks
      </TestnetLink>

      <TestnetLink
        className={`nav-link ${pathname.toString().includes('transactions') ? 'active' : ''}`}
        to="/transactions"
        onClick={() => onToggle(false)}
      >
        Transactions
      </TestnetLink>

      <TestnetLink
        className={`nav-link ${pathname.toString().includes('validators') ? 'active' : ''}`}
        to="/validators"
        onClick={() => onToggle(false)}
      >
        Validators
      </TestnetLink>
    </>
  );
}
