import type { ReactNode } from 'react';

export interface TabType {
  tabTo: string;
  tabLabel: ReactNode;
  activationRoutes?: string[];
  show?: boolean;
}

export interface TabsPropsType {
  tabs: TabType[];
}
