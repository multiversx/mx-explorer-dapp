import React, { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Popover, Navbar } from 'react-bootstrap';
import { faNetworkWired, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from './../../assets/img/elrond.svg';
import { useGlobalState } from '../../context';

export default function Home() {
  const { config } = useGlobalState();
  const changeTestnet = (e: SyntheticEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.warn(11, id);
  };

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
                  {config.testnets.map(testnet => (
                    <a
                      className="nav-link"
                      key={testnet.id}
                      href="/#"
                      onClick={e => changeTestnet(e, testnet.id)}
                    >
                      {testnet.name}
                    </a>
                  ))}
                </Popover.Content>
              </Popover>
            }
          >
            <span id="switch" className="switch d-none d-md-block d-lg-block d-xl-block">
              <i className="fa fa-network-wired" />
              <FontAwesomeIcon icon={faNetworkWired} />
            </span>
          </OverlayTrigger>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
