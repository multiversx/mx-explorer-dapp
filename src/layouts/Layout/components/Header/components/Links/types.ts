import { MouseEvent } from 'react';

export interface LinksPropsType {
  onClick: (event: MouseEvent) => void;
}

export interface MenuLinkType {
  label: string;
  to: string;
  show: boolean;
  activeRoutes: string[];
  subRoutes?: MenuLinkType[];
}
