import elrondLogo from 'assets/img/elrond-symbol.svg';
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { TestnetLink } from 'sharedComponents';
import AppSwitcher from './AppSwitcher';
import ExplorerNavbar from './ExplorerNavbar';

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
        <AppSwitcher activeAppId="explorer" />
        <ExplorerNavbar />
      </div>
    </Navbar>
  );
}
