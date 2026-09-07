import React, { useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';

import { setMetaTags } from 'redux/slices';

export const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    });

    return () => clearTimeout(timeoutId);
  }, []);

  return <>{children}</>;
};

export const withPageTitle = (
  title: string,
  Component: React.ComponentType,
  preventScroll?: boolean
) => {
  const Memoized = memo(() => (
    <ScrollToTop>
      <Component />
    </ScrollToTop>
  ));

  return () => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(
        setMetaTags({
          pageName: title
        })
      );
    }, []);

    return preventScroll ? <Component /> : <Memoized />;
  };
};
