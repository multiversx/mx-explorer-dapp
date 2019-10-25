import React from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Popover, Navbar } from 'react-bootstrap';
import { faNetworkWired, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from './../../assets/img/elrond.svg';

export default function Home() {
  return (
    <Navbar collapseOnSelect expand="md">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={elrondLogo} alt="Elrond logo" />
        </Link>
        <Navbar.Toggle aria-controls="navbars" style={{ color: 'black', border: 'none' }}>
          <FontAwesomeIcon icon={faBars} />
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
              <Link className="nav-link" to="/transactions/page/1">
                transactions
              </Link>
            </li>
            <li className="nav-item" ng-class="{active: locationPath.indexOf('validator') >= 0}">
              <Link className="nav-link" to="/validators">
                validators
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
          <OverlayTrigger
            trigger="click"
            key="popover"
            placement="bottom"
            rootClose
            overlay={
              <Popover id={`popover-positioned-bottom`}>
                <Popover.Content>
                  <Link className="nav-link" to="/validators">
                    Testnet 1000
                  </Link>
                  <Link className="nav-link" to="/wallet">
                    Cryptobubbles
                  </Link>
                </Popover.Content>
              </Popover>
            }
          >
            <a id="switch" href="#/ceva" className="switch d-none d-md-block d-lg-block d-xl-block">
              <i className="fa fa-network-wired" />
              <FontAwesomeIcon icon={faNetworkWired} />
            </a>
          </OverlayTrigger>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
