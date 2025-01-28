import { ReactNode } from 'react';

export interface ColSpanWrapperUIType {
  colSpan: number;
  children?: ReactNode;
}

export const ColSpanWrapper = ({ colSpan, children }: ColSpanWrapperUIType) => (
  <tr>
    <td colSpan={colSpan}>{children}</td>
  </tr>
);
