/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type LazyLoadProps<TLazy extends React.ComponentType<any>> = {
  loader: Promise<{ default: TLazy }>;
} & React.ComponentProps<TLazy>;
const LazyLoad = <TLazy extends React.ComponentType<any>>({
  loader,
  ...props
}: LazyLoadProps<TLazy>) => {
  const LazyComponent = React.useMemo(() => React.lazy(() => loader), [loader]);

  return (
    <React.Suspense>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

export default LazyLoad;
