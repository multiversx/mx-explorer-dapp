import { ReactNode, MouseEvent } from 'react';
import { LinkProps } from 'react-router-dom';

import { WithClassnameType } from 'types';

export interface NetworkLinkUIType extends WithClassnameType, LinkProps {
  title?: string;
  preventScrollReset?: boolean;
  onClick?: (event: MouseEvent) => void;
  to: string;
  children: ReactNode | string;
}
