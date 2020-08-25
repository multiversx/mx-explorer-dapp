import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { defaultTestnet } from 'context/config';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function TestnetSwitcher({ onToggle }: { onToggle: (prop: boolean) => void }) {
  const globalState = useGlobalState();

  const liksArray = globalState.config.testnets.map((testnet) => ({
    name: testnet.name,
    to: testnet.id === globalState.defaultTestnet.id ? '' : testnet.id,
    key: testnet.id,
  }));

  const hidePopover = () => {
    document.body.click();
    onToggle(false);
  };

  const changeTestnet = (testnetId: string) => (e: React.MouseEvent) => {
    hidePopover();
    if (globalState.activeTestnetId !== testnetId) {
      const testnet =
        globalState.config.testnets.find((t) => {
          if (testnetId) {
            return t.id === testnetId;
          } else return t.default;
        }) || defaultTestnet;

      if (!testnet.default) {
        switch (testnet.name.toLocaleLowerCase()) {
          case 'mainnet':
            e.preventDefault();
            window.location.href = 'https://explorer.elrond.com/';
            break;
          case 'testnet':
            e.preventDefault();
            window.location.href = 'https://testnet-explorer.elrond.com/';
            break;
          default:
            break;
        }
      }
    }
  };

  return (
    <>
      <NavDropdown
        title={
          <span id="switch" data-testid="testnetSwitch" className="switch">
            {globalState.activeTestnet.name}&nbsp;
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        }
        id="basic-nav-dropdown"
      >
        {liksArray.map((link) => {
          return (
            <Link
              className={`dropdown-item ${globalState.activeTestnetId === link.to ? 'active' : ''}`}
              key={link.key}
              to={`/${link.to}`}
              onClick={changeTestnet(link.to)}
            >
              {link.name}
            </Link>
          );
        })}
      </NavDropdown>
    </>
  );
}
