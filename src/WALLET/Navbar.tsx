import React from 'react';
import { Navbar } from 'react-bootstrap';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import elrondLogo from 'assets/img/elrond.svg';
import TestnetSwitcher from '../components/Layout/Navbar/TestnetSwitcher';
import { TestnetLink } from '../sharedComponents';

export default function SiteNavbar() {
  const [expanded, setExpanded] = React.useState(false);

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Navbar collapseOnSelect expand="md" onToggle={onToggle} expanded={expanded}>
      <div className="container">
        <TestnetLink className="navbar-brand" to="/">
          <div className="d-none d-md-block d-lg-block d-xl-block" style={{ marginTop: '-2px' }}>
            <img src={elrondLogo} alt="Elrond logo" />
          </div>
          <div className="d-xs-block d-sm-block d-md-none d-lg-none d-xl-none">
            <img src={elrondLogo} alt="Elrond logo" />
          </div>
        </TestnetLink>
        <Navbar.Toggle aria-controls="navbars" style={{ color: 'black', border: 'none' }}>
          {expanded ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </Navbar.Toggle>
        <Navbar.Collapse id="navbars">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item active`} onClick={() => onToggle(false)}>
              wallet
            </li>
          </ul>
          <TestnetSwitcher onToggle={onToggle} />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
