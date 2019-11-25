import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../../../context';
import { Search, TestnetLink } from '../../../sharedComponents';
import TestnetSwitcher from './TestnetSwitcher';

interface ExplorerNavbarType {
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExplorerNavbar({
  expanded = false,
  setExpanded = () => null,
}: ExplorerNavbarType) {
  const {
    activeTestnet: { validators },
    activeTestnetId,
  } = useGlobalState();

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
        <ul className="navbar-nav mr-auto">
          <li
            className={`nav-item ${
              pathname.toString() === '/' || pathname.toString() === `/${activeTestnetId}`
                ? 'active'
                : ''
            }`}
            onClick={() => onToggle(false)}
          >
            <TestnetLink className="nav-link" to="/">
              Dashboard
            </TestnetLink>
          </li>
          <li
            className={`nav-item ${pathname.toString().includes('blocks') ? 'active' : ''}`}
            onClick={() => onToggle(false)}
          >
            <TestnetLink className="nav-link" to="/blocks">
              Blocks
            </TestnetLink>
          </li>
          <li
            onClick={() => onToggle(false)}
            className={`nav-item ${pathname.toString().includes('transactions') ? 'active' : ''}`}
          >
            <TestnetLink className="nav-link" to="/transactions">
              Transactions
            </TestnetLink>
          </li>
          {validators !== false && (
            <li
              onClick={() => onToggle(false)}
              className={`nav-item ${pathname.toString().includes('validators') ? 'active' : ''}`}
            >
              <TestnetLink className="nav-link" to="/validators">
                Validators
              </TestnetLink>
            </li>
          )}
        </ul>
        {!['/', `/${activeTestnetId}`, `/${activeTestnetId}/`].includes(pathname) && (
          <div className="form-search" role="search">
            <div
              className="input-group input-group-seamless float-right"
              style={{ maxWidth: '18rem' }}
            >
              <Search />
            </div>
          </div>
        )}

        <TestnetSwitcher onToggle={onToggle} />
      </Navbar.Collapse>
    </>
  );
}
