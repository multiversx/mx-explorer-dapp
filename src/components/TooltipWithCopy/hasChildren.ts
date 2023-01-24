import { isValidElement, ReactElement, ReactNode } from 'react';

export const hasChildren = (
  element: ReactNode
): element is ReactElement<{ children: ReactNode[] }> =>
  isValidElement<{ children?: ReactNode[] }>(element) &&
  Boolean(element.props.children);
