import { Children, isValidElement, ReactNode, ReactText } from 'react';
import hasChildren from './hasChildren';

// eslint-disable-next-line @typescript-eslint/ban-types
export const childToString = (child?: ReactText | boolean | {} | null): string => {
  if (typeof child === 'undefined' || child === null || typeof child === 'boolean') {
    return '';
  }

  if (JSON.stringify(child) === '{}') {
    return '';
  }

  return (child as string | number).toString();
};

const onlyText = (children: ReactNode): string => {
  if (!(children instanceof Array) && !isValidElement(children)) {
    return childToString(children);
  }

  const string: string = Children.toArray(children).reduce(
    (text: string, child: ReactNode): any => {
      let newText = '';

      if (isValidElement(child) && hasChildren(child)) {
        newText = onlyText(child.props.children);
      } else if (isValidElement(child) && !hasChildren(child)) {
        newText = '';
      } else {
        newText = childToString(child);
      }

      return text.concat(newText);
    },
    ''
  );

  return string.toString();
};

export default onlyText;
