import React, { useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';

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
    const Memoized = memo(() => (
      <ScrollToTop>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Component />
      </ScrollToTop>
    ));

    return preventScroll ? <Component /> : <Memoized />;
  };
