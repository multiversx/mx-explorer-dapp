import React, { useEffect } from 'react';

import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Led } from 'components';
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
    id: network.id || ''
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
        <div
          className='nav-link-icon d-flex flex-fill align-items-center px-lg-2'
          data-testid='networkSwitch'
        >
          <Led color='bg-primary d-flex' />
          <span className='ps-lg-2 pe-2'>{activeNetwork.name}</span>
          <FontAwesomeIcon className='d-inline-block ms-1' icon={faAngleDown} />
        </div>
      }
      className='nav-dropdown'
      id='network-switcher-dropdown'
    >
      {links.length > 0
        ? links.map((link) => <NetworkUrl link={link} key={link.id} />)
        : linksArray.map((link) => (
            <NetworkUrl link={link} key={link.id} internal />
          ))}
    </NavDropdown>
  );
};
