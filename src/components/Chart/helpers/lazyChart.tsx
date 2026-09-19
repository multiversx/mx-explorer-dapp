import { ComponentType, lazy, Suspense } from 'react';

export const lazyChart = <PropsType extends object>(
  loader: () => Promise<{ default: ComponentType<PropsType> }>
) => {
  const Loaded = lazy(loader);

  const LazyChart = (props: PropsType) => (
    <Suspense fallback={null}>
      <Loaded {...props} />
    </Suspense>
  );

  return LazyChart;
};
