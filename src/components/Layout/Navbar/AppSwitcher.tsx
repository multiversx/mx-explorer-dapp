import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from 'assets/img/elrond-symbol.svg';
import { useGlobalState } from 'context';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';

export default function AppSwitcher() {
  const {
    config: { elrondApps: apps },
  } = useGlobalState();

  const hidePopover = () => {
    document.body.click();
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const appId = apps.filter(app => app.id === window.location.hostname.split('.')[0]).pop();
  const devApp = process.env.REACT_APP_WALLET ? 'wallet' : 'explorer';

  const activeAppId = appId ? appId.id : devApp;

  return (
    <NavDropdown
      title={
        <span className="appSwitcherButton" onClick={onClick}>
          <img src={elrondLogo} alt="Elrond Logo" className="mr-2" height="30" />
          <span className="activeApp">
            {(apps.filter(app => app.id === activeAppId).pop() as any).name}{' '}
            <small>
              <FontAwesomeIcon icon={faAngleDown} />
            </small>
          </span>
        </span>
      }
      id="basic-nav-dropdown"
      className="brandDropdown"
    >
      {apps.map(app => {
        return (
          <NavDropdown.Item
            key={app.id}
            onClick={hidePopover}
            href={app.to}
            target={`${activeAppId === app.id ? '' : '_blank'}`}
            rel="noopener noreferrer"
            className={`${activeAppId === app.id ? 'active' : ''}`}
          >
            {app.name}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}
