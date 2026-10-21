import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { WithClassnameType } from 'types';

export interface HeroDescriptionUIType extends WithClassnameType {
  description?: string;
}

export const HeroDescription = ({
  description,
  className
}: HeroDescriptionUIType) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isExpanded) {
      return;
    }

    const checkTruncation = () => {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    };

    checkTruncation();
    const observer = new ResizeObserver(checkTruncation);
    observer.observe(element);

    return () => observer.disconnect();
  }, [description, isExpanded]);

  if (!description) {
    return null;
  }

  const isToggleable = isTruncated || isExpanded;

  const toggle = () => {
    if (window.getSelection()?.toString()) {
      return;
    }
    setIsExpanded((expanded) => !expanded);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsExpanded((expanded) => !expanded);
    }
  };

  return (
    <div
      ref={ref}
      className={classNames('description', className, {
        'line-clamp-2': !isExpanded,
        'cursor-pointer': isToggleable
      })}
      title={isTruncated && !isExpanded ? description : undefined}
      {...(isToggleable
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-expanded': isExpanded,
            onClick: toggle,
            onKeyDown
          }
        : {})}
    >
      {description}
    </div>
  );
};
