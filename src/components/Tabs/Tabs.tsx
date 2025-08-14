import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { NetworkLink } from 'components';
import { useActiveRoute, useNetworkRoute } from 'hooks';
import { faEllipsis } from 'icons/regular';

import { TabsPropsType, TabType } from './types';

const CustomToggle = forwardRef(
  ({ children, onClick, isExtraTabActive }: any, ref: any) => (
    <button
      type='button'
      className={`btn-unstyled tab extra-tab ${
        isExtraTabActive ? 'active' : ''
      }`}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </button>
  )
);

export const Tabs = (props: TabsPropsType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tabs, className } = props;

  const checkTabStatus = (tab: TabType) => {
    if (tab.activationRoutes && tab.activationRoutes.length > 0) {
      return tab.activationRoutes.some((route) => activeRoute(route));
    }

    return activeRoute(tab.tabTo ?? '');
  };

  const tabFilter = (filterName = '', filterValue = '') => {
    const nextUrlParams = {
      ...Object.fromEntries(searchParams),
      ...(filterName && filterValue ? { [filterName]: filterValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const navigate = useNavigate();
  const activeRoute = useActiveRoute();
  const networkRoute = useNetworkRoute();
  const filteredTabs = tabs.filter((tab) => tab.show !== false);
  const displayTabs = filteredTabs.filter((tab) => Boolean(!tab?.extra));
  const extraTabs = filteredTabs.filter((tab) => Boolean(tab?.extra));
  const isExtraTabActive =
    extraTabs.filter((extraTab) => checkTabStatus(extraTab)).length > 0;
  const filters = Object.fromEntries(searchParams);

  return (
    <menu
      className={classNames(
        'navbar-nav flex-row flex-wrap tabs mt-0',
        className
      )}
    >
      {displayTabs.map((tab) => {
        if (tab.tabTo) {
          return (
            <li key={tab.tabTo} className='d-flex'>
              <NetworkLink
                to={tab.tabTo}
                className={`nav-item tab ${
                  checkTabStatus(tab) ? 'active' : ''
                }`}
                preventScrollReset={true}
              >
                {tab.tabLabel}
              </NetworkLink>
            </li>
          );
        }

        if (tab.filterName && tab.filterValue) {
          const currentFilter = Object.keys(filters).find(
            (str) => str === tab.filterName
          );

          return (
            <li key={tab.filterValue} className='d-flex'>
              <button
                type='button'
                className={`nav-item tab btn btn-link ${
                  filters?.[currentFilter ?? ''] === tab.filterValue ||
                  tab.defaultActive
                    ? 'active'
                    : ''
                }`}
                onClick={() => {
                  tabFilter(tab.filterName, tab.filterValue);
                }}
              >
                {tab.tabLabel}
              </button>
            </li>
          );
        }

        return null;
      })}
      {extraTabs.length > 0 && (
        <Dropdown
          onSelect={(eventKey) => {
            if (eventKey) {
              navigate(networkRoute(eventKey));
            }
          }}
        >
          <Dropdown.Toggle
            as={CustomToggle}
            isExtraTabActive={isExtraTabActive}
            aria-label='Show More'
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {extraTabs.map((extraTab) => (
              <Dropdown.Item
                as={Anchor}
                key={extraTab.tabTo}
                eventKey={extraTab.tabTo}
                active={checkTabStatus(extraTab)}
              >
                {extraTab.tabLabel}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </menu>
  );
};
