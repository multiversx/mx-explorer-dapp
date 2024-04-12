import { ReactNode, MouseEvent } from 'react';

import { WithClassnameType } from 'types';

export interface NetworkLinkUIType extends WithClassnameType {
  title?: string;
  preventScrollReset?: boolean;
  onClick?: (event: MouseEvent) => void;
  to: string;
  children: ReactNode | string;
}
