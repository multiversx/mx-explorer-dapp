import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { NetworkLink } from 'components';
import { useActiveRoute } from 'hooks';
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
  const { tabs } = props;

  const checkTabStatus = (tab: TabType) => {
    if (tab.activationRoutes && tab.activationRoutes.length > 0) {
      return tab.activationRoutes.some((route) => activeRoute(route));
    }

    return activeRoute(tab.tabTo);
  };

  const navigate = useNavigate();
  const activeRoute = useActiveRoute();
  const filteredTabs = tabs.filter((tab) => tab.show !== false);
  const displayTabs = filteredTabs.filter((tab) => Boolean(!tab?.extra));
  const extraTabs = filteredTabs.filter((tab) => Boolean(tab?.extra));
  const isExtraTabActive =
    extraTabs.filter((extraTab) => checkTabStatus(extraTab)).length > 0;

  return (
    <div className='tabs'>
      {displayTabs.map((tab) => (
        <NetworkLink
          key={tab.tabTo}
          to={tab.tabTo}
          className={`tab ${checkTabStatus(tab) ? 'active' : ''}`}
          preventScrollReset={true}
        >
          {tab.tabLabel}
        </NetworkLink>
      ))}
      {extraTabs.length > 0 && (
        <Dropdown
          onSelect={(eventKey) => {
            if (eventKey) {
              navigate(eventKey);
            }
          }}
        >
          <Dropdown.Toggle
            as={CustomToggle}
            isExtraTabActive={isExtraTabActive}
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
    </div>
  );
};
