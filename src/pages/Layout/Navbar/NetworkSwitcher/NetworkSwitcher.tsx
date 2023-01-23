import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { links, networks } from 'config';
import { networksSelector } from 'redux/selectors';
import { changeNetwork } from 'redux/slices';
import { NetworkUrl } from './NetworkUrl';

export const NetworkSwitcher = ({ onToggle }: { onToggle?: () => void }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const { activeNetwork, defaultNetwork } = useSelector(networksSelector);

  const linksArray = networks.map((network) => ({
    name: network.name || '',
    url: network.explorerAddress || '',
    id: network.id || '',
  }));

  useEffect(() => {
    const locationArray = pathname.substring(1).split('/');
    const networkId = locationArray[0];

    if (networkId) {
      const foundNetwork = networks.find(({ id }) => id === networkId);

      if (foundNetwork && defaultNetwork?.id !== networkId) {
        dispatch(changeNetwork(foundNetwork));
      } else {
        dispatch(changeNetwork(defaultNetwork));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavDropdown
      title={
        <div className="nav-link-icon flex-fill pe-0 ps-lg-1 ml-lg-2" data-testid="networkSwitch">
          {activeNetwork.name}
          <FontAwesomeIcon className="d-inline-block ml-1" icon={faAngleDown} />
        </div>
      }
      id="network-switcher-dropdown"
    >
      {links.length > 0
        ? links.map((link) => <NetworkUrl link={link} key={link.id} />)
        : linksArray.map((link) => <NetworkUrl link={link} key={link.id} internal />)}
    </NavDropdown>
  );
};
