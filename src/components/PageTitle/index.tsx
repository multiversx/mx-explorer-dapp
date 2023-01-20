import React, { useEffect, memo } from 'react';

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  return <>{children}</>;
};

const withPageTitle = (title: string, Component: React.ComponentType) => () => {
  const Memoized = memo(() => (
    <ScrollToTop>
      <Component />
    </ScrollToTop>
  ));

  useEffect(() => {
    document.title = title;
  }, []);
  return <Memoized />;
};

export default withPageTitle;
