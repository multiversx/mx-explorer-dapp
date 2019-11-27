import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from 'assets/img/elrond-symbol.svg';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';

type AppIdType = 'wallet' | 'explorer' | 'studio' | 'docs';

interface AppsType {
  id: AppIdType;
  name: string;
  to: string;
}

const apps: AppsType[] = [
  {
    id: 'wallet',
    name: 'Wallet',
    to: 'https://wallet.elrond.com/',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    to: 'https://explorer.elrond.com/',
  },
  // {
  //   id: 'studio',
  //   name: 'Studio',
  //   to: 'https://studio.elrond.com/',
  // },
  {
    id: 'docs',
    name: 'Docs',
    to: 'https://docs.elrond.com/',
  },
];

export default function AppSwitcher() {
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
          <img src={elrondLogo} alt="Elrond logo" className="mr-2" height="30" />
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
            className={`${activeAppId === app.id ? 'active' : ''}`}
          >
            {app.name}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}
