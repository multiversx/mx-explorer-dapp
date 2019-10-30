import React, { SyntheticEvent } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useGlobalState, useGlobalDispatch } from '../../../context';

export default function TestnetSwitcher() {
  const globalState = useGlobalState();
  const dispatch = useGlobalDispatch();
  const history = useHistory();

  const changeTestnet = (e: SyntheticEvent, testnetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    dispatch({ type: 'changeTestnet', testnetId });
    history.push('/');
  };
  return (
    <OverlayTrigger
      trigger="click"
      key="popover"
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-positioned-bottom">
          <Popover.Content>
            {globalState.config.testnets.map(testnet => (
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
  );
}
