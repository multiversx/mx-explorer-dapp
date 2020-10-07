import React from 'react';
import { Nav, Collapse } from 'react-bootstrap';
import AppSwitcher from './AppSwitcher';
import { Link } from 'react-router-dom';
import { ReactComponent as ElrondLogo } from 'assets/img/logo.svg';
import { ReactComponent as ElrondSymbol } from 'assets/img/symbol.svg';
import { Search } from 'sharedComponents';
import NetworkSwitcher from './NetworkSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import NavLinks from './NavLinks';

export default function Navbar() {
  // TODO see if still needed
  const [expanded, setExpanded] = React.useState(false);
  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const [headerNavCollapsed, setHeaderNavCollapsed] = React.useState(false);
  const toggleHeaderNav = (e: React.MouseEvent) => {
    e.preventDefault();
    setHeaderNavCollapsed(!headerNavCollapsed);
  };

  return (
    <>
      <div className="main-navbar sticky-top">
        <div className="p-0 container">
          <Nav className="align-items-stretch flex-md-nowrap p-0 navbar">
            <div className="d-flex align-items-center navbar-brand">
              <Link to="/" className="mr-0 ml-3 mr-auto">
                <ElrondSymbol className="main-symbol d-sm-none" />
                <ElrondLogo className="main-logo d-none d-sm-block" />
              </Link>
              <span className="text-secondary">Explorer</span>
            </div>

            <div className="d-flex flex-fill">
              <form className="main-navbar__search w-100 d-flex">
                <div className="ml-3 input-group input-group-seamless">
                  <Search />
                </div>
              </form>
            </div>

            <div className="d-flex align-items-center">
              <NetworkSwitcher onToggle={onToggle} />
            </div>

            <AppSwitcher />

            <div className="nav d-lg-none">
              <a
                className="nav-link nav-link-icon text-center border-left"
                href="/"
                onClick={toggleHeaderNav}
              >
                <i className="material-icons">
                  <FontAwesomeIcon icon={faBars} />
                </i>
              </a>
            </div>
          </Nav>
        </div>
      </div>

      <div className={`header-navbar d-lg-flex p-0 border-top`}>
        <Collapse in={headerNavCollapsed}>
          <div className="container d-lg-flex">
            <div className="row">
              <div className="col d-flex flex-column flex-lg-row">
                <NavLinks setExpanded={setHeaderNavCollapsed} />
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
}
