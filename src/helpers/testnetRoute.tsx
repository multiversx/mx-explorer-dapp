type TestnetRouteType = {
  to: string;
  activeTestnetId: string;
};

const testnetRoute = ({ to, activeTestnetId }: TestnetRouteType): string =>
  activeTestnetId ? `/${activeTestnetId}${to}` : to;

export default testnetRoute;
