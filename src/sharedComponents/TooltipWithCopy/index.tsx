import React from 'react';
import onlyText from './onlyText';
import PopoverStickOnHover from './PopoverStickOnHover';
import { CopyButton } from 'sharedComponents';

const TooltipWithCopy = ({
  children,
  textToCopy,
}: {
  textToCopy?: string;
  children: React.ReactNode;
}) => {
  const childAsText = onlyText(children);
  const copy = textToCopy ? textToCopy : childAsText;

  return (
    <PopoverStickOnHover
      component={
        <div className="d-flex tooltip-inner mw-100">
          {childAsText}
          <CopyButton text={copy} />
        </div>
      }
      placement="top"
      delay={200}
    >
      <span>{children}</span>
    </PopoverStickOnHover>
  );
};

export default TooltipWithCopy;
