import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavbarWrapper } from '../components/Layout/Navbar';
import TestnetSwitcher from '../components/Layout/Navbar/TestnetSwitcher';
import { useWalletDispatch } from './context';

export default function SiteNavbar() {
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useWalletDispatch();

  const onToggle = (isExpanded: boolean) => {
    dispatch({ type: 'logout' });
    setExpanded(isExpanded);
  };

  return (
    <NavbarWrapper>
      <>
        <Navbar.Toggle aria-controls="navbars" style={{ color: 'black', border: 'none' }}>
          {expanded ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </Navbar.Toggle>
        <Navbar.Collapse id="navbars">
          <Nav className="ml-auto testnetSwithcerNav">
            <TestnetSwitcher onToggle={onToggle} />
          </Nav>
        </Navbar.Collapse>
      </>
    </NavbarWrapper>
  );
}
