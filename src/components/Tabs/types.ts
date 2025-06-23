import { ReactNode } from 'react';
import { WithClassnameType } from 'types';

export interface TabType {
  tabLabel: ReactNode;
  tabTo?: string;
  activationRoutes?: string[];
  show?: boolean;
  extra?: boolean;
  defaultActive?: boolean;
  filterName?: string;
  filterValue?: string;
}

export interface TabsPropsType extends WithClassnameType {
  tabs: TabType[];
}
