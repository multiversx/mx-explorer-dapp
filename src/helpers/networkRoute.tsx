type NetworkRouteType = {
  to: string;
  activeNetworkId: string;
};

const networkRoute = ({ to, activeNetworkId }: NetworkRouteType): string =>
  activeNetworkId ? `/${activeNetworkId}${to}` : to;

export default networkRoute;
