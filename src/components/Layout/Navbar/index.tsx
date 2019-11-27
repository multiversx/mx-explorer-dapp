import Popper from 'popper.js';
import React from 'react';
import { Navbar } from 'react-bootstrap';
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
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-white"
      onToggle={onToggle}
      expanded={expanded}
    >
      <div className="container navContainer">
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
