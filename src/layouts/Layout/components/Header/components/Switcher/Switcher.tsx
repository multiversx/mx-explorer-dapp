import React from 'react';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Anchor, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { networks, links } from 'config';

import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

export const Switcher = () => {
  const { id: activeNetworkId, name: activeNetworkName } = useSelector(
    activeNetworkSelector
  );
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  const networkLinks = networks.map(({ name, id }) => ({
    name,
    url: id === defaultNetworkId ? '/' : `/${id}`,
    id
  }));

  return (
    <Dropdown className='switcher'>
      <Dropdown.Toggle
        id='network-switch'
        variant='dark'
        className='btn-unstyled control'
      >
        <div className='value text-truncate'>{activeNetworkName}</div>
        <FontAwesomeIcon
          className='ms-auto indicator'
          icon={faAngleDown}
          size='lg'
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {links.length > 0 ? (
          <>
            {links.map((link) => (
              <a
                key={link.id}
                target='_blank'
                rel='noreferrer nofollow noopener'
                className={classNames('dropdown-item', {
                  active: activeNetworkId === link.id
                })}
                href={link.url}
              >
                {link.name}
              </a>
            ))}
          </>
        ) : (
          <>
            {networkLinks.map((link) => (
              <Dropdown.Item
                as={Anchor} // This is needed due to issues between threejs, react-bootstrap and typescript, what a time to be alive: https://github.com/react-bootstrap/react-bootstrap/issues/6283
                href={link.url}
                key={link.url}
                active={activeNetworkId === link.id}
              >
                {link.name}
              </Dropdown.Item>
            ))}
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
