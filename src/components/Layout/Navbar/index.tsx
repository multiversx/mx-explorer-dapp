import elrondLogo from 'assets/img/elrond-symbol.svg';
import Popper from 'popper.js';
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { TestnetLink } from 'sharedComponents';
import AppSwitcher from './AppSwitcher';
import ExplorerNavbar from './ExplorerNavbar';

// fix dropdown blurry text
(Popper.Defaults as any).modifiers.computeStyle.gpuAcceleration = false;

export function NavbarWrapper({ children }: { children: any }) {
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
        <AppSwitcher />
        {React.cloneElement(children, { expanded, setExpanded })}
      </div>
    </Navbar>
  );
}

export default function SiteNavbar() {
  return (
    <NavbarWrapper>
      <ExplorerNavbar />
    </NavbarWrapper>
  );
}
