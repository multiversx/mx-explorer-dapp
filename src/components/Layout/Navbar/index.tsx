import React from 'react';
import { Nav, Collapse } from 'react-bootstrap';
import AppSwitcher from './AppSwitcher';
import { Link } from 'react-router-dom';
import { ReactComponent as ElrondLogo } from 'assets/img/logo.svg';
import { ReactComponent as ElrondSymbol } from 'assets/img/symbol.svg';
import { Search } from 'sharedComponents';
import NetworkSwitcher from './NetworkSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import NavLinks from './NavLinks';

export default function Navbar() {
  const toggleState = () => {
    const collapsed = !headerNavCollapsed;

    if (collapsed) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    setHeaderNavCollapsed(collapsed);
  };

  const [headerNavCollapsed, setHeaderNavCollapsed] = React.useState(false);
  const toggleHeaderNav = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleState();
  };

  return (
    <>
      <div className="main-navbar sticky-top">
        <div className="p-0 container">
          <Nav className="align-items-stretch flex-nowrap p-0 navbar">
            <div className="d-flex align-items-center navbar-brand">
              <Link to="/" className="mr-0 ml-3 mr-auto">
                <ElrondSymbol className="main-symbol d-sm-none" />
                <ElrondLogo className="main-logo d-none d-sm-block" />
              </Link>
              <span className="text-secondary">Explorer</span>
            </div>

            <div className="d-flex flex-fill">
              <form className="main-navbar__search w-100 d-flex">
                <div className="input-group input-group-seamless">
                  <Search />
                </div>
              </form>
            </div>

            <div className="d-none d-lg-flex">
              <AppSwitcher onToggle={() => {}} />
            </div>

            <div className="d-none d-lg-flex align-items-strech">
              <NetworkSwitcher onToggle={() => {}} />
            </div>

            <div className="nav d-lg-none">
              <a className="nav-link nav-link-icon text-center" href="/" onClick={toggleHeaderNav}>
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
              <div className="col d-flex flex-column flex-lg-row py-3 py-lg-0">
                <NavLinks setExpanded={setHeaderNavCollapsed} />
                <div className="d-lg-none">
                  <AppSwitcher onToggle={toggleState} />
                </div>

                <div className="d-lg-none">
                  <NetworkSwitcher onToggle={toggleState} />
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
}
