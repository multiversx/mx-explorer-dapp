import { ReactNode } from 'react';

export interface TabType {
  tabTo: string;
  tabLabel: ReactNode;
  activationRoutes?: string[];
  show?: boolean;
  extra?: boolean;
}

export interface TabsPropsType {
  tabs: TabType[];
}
