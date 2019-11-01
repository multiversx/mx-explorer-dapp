import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../context';

export default function TestnetSwitcher() {
  const globalState = useGlobalState();

  const liksArray = globalState.config.testnets.map(testnet => ({
    name: testnet.name,
    to: testnet.id === globalState.defaultTestnet.id ? '' : testnet.id,
    key: testnet.id,
  }));

  return (
    <OverlayTrigger
      trigger="click"
      key="popover"
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-positioned-bottom">
          <Popover.Content>
            {liksArray.map(link => (
              <Link className="nav-link" key={link.key} to={`/${link.to}`}>
                {link.name}
              </Link>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <span id="switch" className="switch d-none d-md-block d-lg-block d-xl-block">
        <FontAwesomeIcon icon={faNetworkWired} />
      </span>
    </OverlayTrigger>
  );
}
