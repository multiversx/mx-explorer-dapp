import React, { useEffect, memo } from 'react';

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
        <Component />
      </ScrollToTop>
    ));

    useEffect(() => {
      document.title = title;
    }, []);

    return preventScroll ? <Component /> : <Memoized />;
  };
