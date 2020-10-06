import { faAngleDown } from '@fortawesome/pro-solid-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from 'assets/img/elrond-symbol.svg';
import { useGlobalState } from 'context';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { elrondApps as apps } from 'appConfig';

export default function AppSwitcher() {
  const {
    activeNetwork: { explorerAddress, walletAddress },
  } = useGlobalState();

  const hidePopover = () => {
    document.body.click();
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const appId = apps.filter((app) => app.id === window.location.hostname.split('.')[0]).pop();
  const devApp = process.env.REACT_APP_WALLET ? 'wallet' : 'explorer';

  const activeAppId = appId ? appId.id : devApp;

  return (
    <NavDropdown
      title={
        <span className="appSwitcherButton" onClick={onClick}>
          <img src={elrondLogo} alt="Elrond Logo" className="mr-2" height="30" />
          <span className="activeApp">
            {(apps.filter((app) => app.id === activeAppId).pop() as any).name}{' '}
            <small>
              <FontAwesomeIcon icon={faAngleDown} />
            </small>
          </span>
        </span>
      }
      id="basic-nav-dropdown"
      className="brandDropdown"
    >
      {apps.map((app) => {
        let { name, to } = app;
        if (app.id === 'wallet') {
          to = walletAddress || to;
          name = walletAddress && walletAddress.includes('testnet') ? 'Testnet ' + name : name;
        }
        if (app.id === 'explorer') {
          to = explorerAddress || '';
          name = explorerAddress && explorerAddress.includes('testnet') ? 'Testnet ' + name : name;
        }
        return (
          <NavDropdown.Item
            key={app.id}
            onClick={hidePopover}
            href={to}
            target={`${activeAppId === app.id ? '' : '_blank'}`}
            rel="noopener noreferrer"
            className={`${activeAppId === app.id ? 'active' : ''}`}
          >
            {name}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}
