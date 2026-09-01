import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { useDebounce, useWindowResize } from 'hooks';
import { WithClassnameType } from 'types';

interface TrimUIType extends WithClassnameType {
  text: string;
}

export const Trim = ({
  text,
  className,
  'data-testid': dataTestId = ''
}: TrimUIType) => {
  const [overflow, setOverflow] = useState(false);

  const trimRef = useRef<HTMLSpanElement>(null);
  const hiddenTextRef = useRef<HTMLSpanElement>(null);

  const resizeCount = useWindowResize();
  const debouncedResize = useDebounce(resizeCount, 300);

  useEffect(() => {
    if (trimRef.current && hiddenTextRef.current) {
      const diff =
        hiddenTextRef.current.offsetWidth - trimRef.current.offsetWidth;
      setOverflow(diff > 1);
    }
  }, [debouncedResize, text]);

  return (
    <span
      ref={trimRef}
      className={classNames('trim', className, { overflow: Boolean(overflow) })}
    >
      <span
        ref={hiddenTextRef}
        className='hidden-text-ref'
        data-testid={dataTestId}
      >
        {text}
      </span>

      {overflow ? (
        <>
          <span className='left'>
            <span>
              {String(text).substring(0, Math.floor(text.length / 2))}
            </span>
          </span>
          <span className='ellipsis'>...</span>
          <span className='right'>
            <span>{String(text).substring(Math.ceil(text.length / 2))}</span>
          </span>
        </>
      ) : (
        <>{text}</>
      )}
    </span>
  );
};
