import React from 'react';
import { OverlayTrigger, Popover, Accordion, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired, faCaretDown, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalState } from '../../../context';

export default function TestnetSwitcher() {
  const globalState = useGlobalState();

  const { pathname } = useLocation();
  let locationArray = pathname.substr(1).split('/');
  const testnetId = locationArray[0];

  const liksArray = globalState.config.testnets.map(testnet => ({
    name: testnet.name,
    to: testnet.id === globalState.defaultTestnet.id ? '' : testnet.id,
    key: testnet.id,
  }));

  return (
    <>
      <ul className="navbar-nav mr-auto d-xs-block d-sm-block d-md-none d-lg-none d-xl-none">
        <li className="nav-item">
          <Accordion>
            <Accordion.Toggle as={Nav.Link} eventKey="0">
              testnets
              <FontAwesomeIcon icon={faCaretDown} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <ul className="navbar-nav">
                {liksArray.map(link => (
                  <li className={`nav-item`} key={link.key}>
                    <Link className="nav-link" to={`/${link.to}`}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion.Collapse>
          </Accordion>
        </li>
      </ul>
      <OverlayTrigger
        trigger="click"
        key="popover"
        placement="bottom"
        rootClose
        overlay={
          <Popover id="popover-positioned-bottom">
            <Popover.Content>
              {liksArray.map(link => (
                <Link
                  className={`nav-link ${testnetId === link.to ? 'active' : ''}`}
                  key={link.key}
                  to={`/${link.to}`}
                >
                  {link.name}
                </Link>
              ))}
            </Popover.Content>
          </Popover>
        }
      >
        <span id="switch" className="switch d-none d-md-block d-lg-block d-xl-block">
          {globalState.activeTestnet.name}&nbsp;
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      </OverlayTrigger>
    </>
  );
}
