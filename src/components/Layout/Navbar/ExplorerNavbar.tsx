import { faBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Search, TestnetLink } from 'sharedComponents';
import NetworkSwitcher from './NetworkSwitcher';
interface ExplorerNavbarType {
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExplorerNavbar({
  expanded = false,
  setExpanded = () => null,
}: ExplorerNavbarType) {
  const { activeNetworkId } = useGlobalState();

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const { pathname } = useLocation();

  return (
    <>
      <Navbar.Toggle aria-controls="navbars" style={{ color: 'black', border: 'none' }}>
        {expanded ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
      </Navbar.Toggle>
      <Navbar.Collapse id="navbars">
        <Nav className="mr-auto">
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
        </Nav>
        <Nav className="ml-auto">
          <div className="form-inline py-sm-2" role="search">
            <div className="input-group input-group-seamless" style={{ maxWidth: '18rem' }}>
              <Search />
            </div>
          </div>
        </Nav>
        <Nav className="networkSwithcerNav">
          <NetworkSwitcher onToggle={onToggle} />
        </Nav>
      </Navbar.Collapse>
    </>
  );
}
