import type { ReactNode, MouseEvent } from 'react';

export interface NetworkLinkPropsType {
  className?: string;
  title?: string;
  onClick?: (event: MouseEvent) => void;
  to: string;
  'data-testid'?: string;
  children: ReactNode | string;
}
