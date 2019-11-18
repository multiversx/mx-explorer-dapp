import React from 'react';
import { OverlayTrigger, Popover, Accordion, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../context';

export default function TestnetSwitcher({ onToggle }: { onToggle: Function }) {
  const globalState = useGlobalState();

  const ref = React.useRef(null);

  const liksArray = globalState.config.testnets.map(testnet => ({
    name: testnet.name,
    to: testnet.id === globalState.defaultTestnet.id ? '' : testnet.id,
    key: testnet.id,
  }));

  const hidePopover = () => {
    onToggle(false);
    document.body.click();
  };

  const onAccordionClick = () => {
    ref.current !== null && (ref.current as any).click();
    onToggle(false);
  };

  return (
    <>
      <ul className="navbar-nav mr-auto d-xs-block d-sm-block d-md-none d-lg-none d-xl-none">
        <li className="nav-item">
          <Accordion>
            <Accordion.Toggle as={Nav.Link} eventKey="0">
              <span ref={ref} style={{ paddingBottom: '1rem' }}>
                {globalState.activeTestnet.name}&nbsp;
                <FontAwesomeIcon icon={faAngleDown} />
              </span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <ul className="navbar-nav">
                {liksArray.map(link => (
                  <li key={link.key} onClick={onAccordionClick}>
                    <Link
                      className={`nav-link ${
                        globalState.activeTestnetId === link.to ? 'active' : ''
                      }`}
                      to={`/${link.to}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion.Collapse>
          </Accordion>
        </li>
      </ul>
      <OverlayTrigger
        trigger="click"
        key="popover"
        placement="bottom"
        rootClose
        overlay={
          <Popover id="popover-positioned-bottom">
            <Popover.Content>
              {liksArray.map(link => {
                return (
                  <Link
                    className={`nav-link ${
                      globalState.activeTestnetId === link.to ? 'active' : ''
                    }`}
                    key={link.key}
                    onClick={hidePopover}
                    to={`/${link.to}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </Popover.Content>
          </Popover>
        }
      >
        <span
          id="switch"
          style={{ whiteSpace: 'nowrap', paddingBottom: '4px' }}
          className="switch d-none d-md-block d-lg-block d-xl-block"
        >
          {globalState.activeTestnet.name}&nbsp;
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      </OverlayTrigger>
    </>
  );
}
