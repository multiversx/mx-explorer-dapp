import React from 'react';
import { Link } from 'react-router-dom';
import elrondLogo from './../../assets/img/elrond.svg';

export default function Home() {
  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <a href="/#/" className="navbar-brand">
          <img src={elrondLogo} alt="Elrond logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbars"
          aria-controls="navbars"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className="fa fa-bars" />
            <i className="fa fa-times d-none" />
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbars">
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
              <Link className="nav-link" to="/wallet">
                wallet
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
          <ul
            className="navbar-nav mr-auto mt-5 d-xs-block d-sm-block d-md-none d-lg-none d-xl-none"
            ng-controller="parentCtrl"
          >
            <li
              className="nav-item"
              ng-class="{active: activeNetwork == network.id}"
              ng-repeat="network in networks"
            >
              <a className="nav-link" href="/#/switch/{{network.id}}">
                {'{'}
                {'{'}network.name{'}'}
                {'}'}
              </a>
            </li>
          </ul>
          <a
            id="switch"
            href="#"
            className="switch d-none d-md-block d-lg-block d-xl-block"
            data-toggle="popover"
            data-trigger="focus"
            data-placement="bottom"
          >
            <i className="fa fa-network-wired" />
          </a>
          <div id="popover-content-switch" ng-show="false" ng-controller="parentCtrl">
            <span ng-repeat="network in networks">
              <a
                href="/#/switch/{{network.id}}"
                ng-class="{active: activeNetwork == network.id}"
                className="mt-1"
              >
                {'{'}
                {'{'}network.name{'}'}
                {'}'}
              </a>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
