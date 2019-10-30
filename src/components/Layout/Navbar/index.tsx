import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from './../../../assets/img/elrond.svg';
import TestnetSwitcher from './TestnetSwitcher';
import TestnetLink from './../../../sharedComponents/TestnetLink';

export default function SiteNavbar() {
  const [expanded, setExpanded] = React.useState(false);
  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  return (
    <Navbar collapseOnSelect expand="md" onToggle={onToggle} expanded={expanded}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={elrondLogo} alt="Elrond logo" />
        </Link>
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
              <TestnetLink className="nav-link" to="/transactions/page/1">
                transactions
              </TestnetLink>
            </li>
            <li className="nav-item" ng-class="{active: locationPath.indexOf('validator') >= 0}">
              <Link className="nav-link" to="/blocks/page/1">
                blocks
              </Link>
            </li>
          </ul>
          <div
            className="form-search"
            ng-show="locationPath!='/'"
            ng-controller="processRequestCtrl"
            ng-submit="processRequest()"
            role="search"
          >
            <div
              className="input-group input-group-seamless float-right"
              style={{ maxWidth: '23rem' }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search by Address / Txn Hash / Block Hash"
                name="requestType"
                required
                ng-model="hashRequest"
              />
              <div className="input-group-append">
                <button type="submit" className="input-group-text">
                  <i className="fa fa-search" />
                </button>
              </div>
            </div>
          </div>
          <TestnetSwitcher />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
