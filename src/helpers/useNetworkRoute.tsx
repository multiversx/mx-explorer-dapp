import { useGlobalState } from "context";

export const useNetworkRoute = () => {
  const { activeNetworkId } = useGlobalState();

  return (to: string) => (activeNetworkId ? `/${activeNetworkId}${to}` : to);
};
