import React, { useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';

import { setMetaTags } from 'redux/slices/metaTags';

export const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  return <>{children}</>;
};

export const withPageTitle =
  (title: string, Component: React.ComponentType, preventScroll?: boolean) =>
  () => {
    const dispatch = useDispatch();
    const Memoized = memo(() => (
      <ScrollToTop>
        <Component />
      </ScrollToTop>
    ));

    useEffect(() => {
      dispatch(
        setMetaTags({
          pageName: title
        })
      );
    }, []);

    return preventScroll ? <Component /> : <Memoized />;
  };
