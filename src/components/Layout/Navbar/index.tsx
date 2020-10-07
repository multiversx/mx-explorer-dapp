import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import AppSwitcher from './AppSwitcher';
import { Link } from 'react-router-dom';
import { ReactComponent as ElrondLogo } from 'assets/img/logo.svg';
import { Search } from 'sharedComponents';
import NetworkSwitcher from './NetworkSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import ExplorerNavbar from './ExplorerNavbar';

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
  const [expanded, setExpanded] = React.useState(false);

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    // <NavbarWrapper>
    //   <ExplorerNavbar />
    // </NavbarWrapper>
    <>
      <div className="main-navbar bg-white sticky-top">
        <div className="p-0 container-fluid">
          <Nav className="align-items-stretch flex-md-nowrap p-0 navbar navbar-light">
            <div className="d-flex align-items-center navbar-brand">
              <Link to="/" className="mr-0 ml-3 mr-auto">
                <ElrondLogo className="main-logo" />
              </Link>
              <span className="text-secondary">Explorer</span>
            </div>

            <form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
              <div className="ml-3 input-group input-group-seamless">
                <Search />
              </div>
            </form>

            <div className="d-flex align-items-center">
              <NetworkSwitcher onToggle={onToggle} />
            </div>

            <AppSwitcher />

            {/* <nav className="nav d-md-none d-lg-none">
              <a
                href="/"
                onClick={toggleSidebar}
                className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline d-lg-none text-center border-left"
              >
                <i className="material-icons">
                  <FontAwesomeIcon icon={faBars} />
                </i>
              </a>
            </nav> */}
          </Nav>
        </div>
      </div>

      <div className="header-navbar d-lg-flex p-0 bg-white border-top collapse">
        <div className="container">
          <div className="row">
            <div className="col">Test</div>
          </div>
        </div>
      </div>
    </>
  );
}
