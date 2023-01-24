import React from 'react';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Collapse } from 'react-bootstrap';
import { AppSwitcher } from './AppSwitcher';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { NetworkSwitcher } from './NetworkSwitcher';

export const Navbar = () => {
  const toggleState = () => {
    const collapsed = !headerNavCollapsed;

    if (collapsed) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
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
      <div className='main-navbar sticky-top'>
        <div className='container'>
          <Nav className='align-items-stretch flex-nowrap p-0 navbar'>
            <div className='d-flex align-items-center'>
              <Logo />
            </div>
            <div className='nav-links d-none d-lg-flex flex-fill justify-content-around'>
              <NavLinks />
            </div>
            <div>
              <ul className='flex-row navbar-nav'>
                <li className='nav-item d-none d-lg-flex'>
                  <AppSwitcher />
                </li>

                <li className='nav-item d-none d-lg-flex align-items-strech'>
                  <NetworkSwitcher />
                </li>
              </ul>

              <div className='nav d-lg-none'>
                <a
                  className='nav-link nav-link-icon text-center d-flex align-items-center justify-content-center pe-0'
                  href='/'
                  onClick={toggleHeaderNav}
                >
                  <i className='material-icons' style={{ width: '1.375rem' }}>
                    {headerNavCollapsed ? (
                      <FontAwesomeIcon icon={faTimes} />
                    ) : (
                      <FontAwesomeIcon icon={faBars} />
                    )}
                  </i>
                </a>
              </div>
            </div>
          </Nav>
        </div>
      </div>

      <div className='header-navbar d-lg-none p-0'>
        <Collapse in={headerNavCollapsed}>
          <div className='container d-lg-flex'>
            <div className='row'>
              <div className='col d-flex flex-column flex-lg-row py-3 py-md-0'>
                <NavLinks setExpanded={setHeaderNavCollapsed} />

                <div className='d-lg-none'>
                  <AppSwitcher onToggle={toggleState} />
                </div>

                <div className='d-lg-none'>
                  <NetworkSwitcher onToggle={toggleState} />
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};
