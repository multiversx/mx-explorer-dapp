import { faTh } from '@fortawesome/pro-solid-svg-icons/faTh';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <div className="nav-link nav-link-icon text-center">
          <i className="material-icons icon-sm m-0">
            <FontAwesomeIcon icon={faTh} />
          </i>
        </div>
      }
      id="app-switcher-dropdown"
      alignRight
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
