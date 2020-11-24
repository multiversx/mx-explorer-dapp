import { faTh } from '@fortawesome/pro-solid-svg-icons/faTh';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { elrondApps as apps } from 'appConfig';

export default function AppSwitcher({ onToggle }: { onToggle?: () => void }) {
  const {
    activeNetwork: { explorerAddress, walletAddress },
  } = useGlobalState();

  const hidePopover = () => {
    document.body.click();
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <NavDropdown
      title={
        <div className="nav-link-icon flex-fill text-md-center">
          <i className="material-icons icon-sm m-0 d-none d-md-block">
            <span className="px-1 my-0 mx-2">
              <FontAwesomeIcon icon={faTh} />
            </span>
          </i>
          <span className="d-md-none">Switch to</span>
          <FontAwesomeIcon className="d-inline-block d-md-none ml-1" icon={faAngleDown} />
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
        const isExplorer = app.id === 'explorer';
        if (isExplorer) {
          to = explorerAddress || '';
          name = explorerAddress && explorerAddress.includes('testnet') ? 'Testnet ' + name : name;
        }
        return (
          <NavDropdown.Item
            key={app.id}
            onClick={hidePopover}
            href={to}
            target={`${isExplorer ? '' : '_blank'}`}
            rel="noopener noreferrer"
            className={`${isExplorer ? 'active' : ''}`}
          >
            {name}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}
