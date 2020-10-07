import { faAngleDown } from '@fortawesome/pro-solid-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { defaultNetwork } from 'context/config';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NetworkSwitcher({ onToggle }: { onToggle: (prop: boolean) => void }) {
  const globalState = useGlobalState();

  const liksArray = globalState.config.networks.map((network) => ({
    name: network.name,
    to: network.id === globalState.defaultNetwork.id ? '' : network.id,
    key: network.id,
  }));

  const hidePopover = () => {
    document.body.click();
    onToggle(false);
  };

  const changeNetwork = (networkId: string) => (e: React.MouseEvent) => {
    hidePopover();
    if (globalState.activeNetworkId !== networkId) {
      const network =
        globalState.config.networks.find((t) => {
          if (networkId) {
            return t.id === networkId;
          } else return t.default;
        }) || defaultNetwork;

      if (!network.default) {
        switch (network.name.toLocaleLowerCase()) {
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
          <span id="switch" data-testid="networkSwitch" className="switch">
            {globalState.activeNetwork.name}&nbsp;
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        }
        id="basic-nav-dropdown"
      >
        {liksArray.map((link) => {
          return (
            <Link
              className={`dropdown-item ${globalState.activeNetworkId === link.to ? 'active' : ''}`}
              key={link.key}
              to={`/${link.to}`}
              onClick={changeNetwork(link.to)}
            >
              {link.name}
            </Link>
          );
        })}
      </NavDropdown>
    </>
  );
}
