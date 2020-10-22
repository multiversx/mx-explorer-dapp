import React from 'react';
import { Nav, Collapse } from 'react-bootstrap';
import AppSwitcher from './AppSwitcher';
import { Search } from 'sharedComponents';
import NetworkSwitcher from './NetworkSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import { faMoon } from '@fortawesome/pro-regular-svg-icons/faMoon';
import NavLinks from './NavLinks';
import Logo from './Logo';
import { ReactComponent as Sun } from 'assets/img/sun.svg';
import { useGlobalState, useGlobalDispatch } from 'context';

export default function Navbar() {
  const { activeNetwork, theme } = useGlobalState();
  const dispatch = useGlobalDispatch();

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

  const handleThemeToggleChange = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'changeTheme',
      theme: theme === 'dark' ? String(activeNetwork.theme) : 'dark',
    });
  };

  return (
    <>
      <div className="main-navbar sticky-top">
        <div className="p-0 container">
          <Nav className="align-items-stretch flex-nowrap p-0 navbar">
            <div className="d-flex align-items-center navbar-brand">
              <Logo />
            </div>

            <div className="d-flex flex-fill">
              <form className="main-navbar__search w-100 d-flex">
                <div className="input-group input-group-seamless">
                  <Search />
                </div>
              </form>
            </div>

            <ul className="flex-row navbar-nav">
              {activeNetwork.id === 'mainnet' && (
                <li className="nav-item d-flex align-items-center">
                  <a
                    href="/#"
                    onClick={handleThemeToggleChange}
                    className="nav-link nav-link-icon text-center"
                  >
                    <i className="material-icons icon-sm px-1 my-0 mx-2">
                      {theme === 'dark' ? (
                        <Sun className="sun" />
                      ) : (
                        <FontAwesomeIcon icon={faMoon} />
                      )}
                    </i>
                  </a>
                </li>
              )}
              <li className="nav-item d-none d-lg-flex">
                <AppSwitcher />
              </li>

              <li className="nav-item d-none d-lg-flex align-items-strech">
                <NetworkSwitcher />
              </li>
            </ul>

            <div className="nav d-lg-none">
              <a
                className="nav-link nav-link-icon text-center d-flex align-items-center justify-content-center"
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

      <div className="header-navbar d-lg-flex p-0 border-top">
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
