import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from './../../../assets/img/elrond.svg';
import TestnetSwitcher from './TestnetSwitcher';
import { TestnetLink, Search } from './../../../sharedComponents';

export default function SiteNavbar() {
  const [expanded, setExpanded] = React.useState(false);
  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  const { pathname } = useLocation();

  return (
    <Navbar collapseOnSelect expand="md" onToggle={onToggle} expanded={expanded}>
      <div className="container">
        <TestnetLink className="navbar-brand" to="/">
          <img src={elrondLogo} alt="Elrond logo" />
        </TestnetLink>
        <Navbar.Toggle aria-controls="navbars" style={{ color: 'black', border: 'none' }}>
          {expanded ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </Navbar.Toggle>
        <Navbar.Collapse id="navbars">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" ng-class="{active: locationPath == '/'}">
              <Link className="nav-link" to="/">
                explorer
              </Link>
            </li>
            <li
              className="nav-item"
              ng-class="{active: locationPath == '/wallet/' || locationPath == '/mywallet/' || locationPath == '/unlock-pem/'}"
            >
              <TestnetLink className="nav-link" to="/validators/page/1">
                validators
              </TestnetLink>
            </li>
          </ul>
          {pathname !== '/' && (
            <div className="form-search" role="search">
              <div
                className="input-group input-group-seamless float-right"
                style={{ maxWidth: '23rem' }}
              >
                <Search />
              </div>
            </div>
          )}

          <TestnetSwitcher />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
