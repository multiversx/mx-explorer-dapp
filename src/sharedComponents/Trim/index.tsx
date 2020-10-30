import * as React from 'react';
import { useCallback, useState } from 'react';

interface TrimType {
  text: string;
  'data-testid'?: string;
}

const Trim = (props: TrimType) => {
  const { text } = props;

  const spanProps = {
    ...(props['data-testid'] ? { 'data-testid': props['data-testid'] } : {}),
  };

  const [overflow, setOverflow] = useState(false);

  const resizeHandler = (node: any) => {
    // TODO use ref and debounce
    const wrapper = node.querySelector('.left');
    const content = wrapper.querySelector('span');
    setOverflow(content.offsetWidth > wrapper.offsetWidth);
  };

  const initializeResizeHandler = useCallback((node) => {
    if (node !== null) {
      window.addEventListener('resize', () => {
        resizeHandler(node);
      });
      resizeHandler(node);
    }
  }, []);

  return (
    <span
      ref={initializeResizeHandler}
      className={`trim ${overflow ? 'overflow' : ''}`}
      {...spanProps}
    >
      <span className="left">
        <span>{text.substring(0, Math.floor(text.length / 2))}</span>
      </span>
      <span className="ellipsis">...</span>
      <span className="right">
        <span>{text.substring(Math.ceil(text.length / 2))}</span>
      </span>
    </span>
  );
};

export default Trim;
