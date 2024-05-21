import { DEFAULT_PROVIDER_COLORS } from 'appConstants';

interface PastelColorType {
  currentIndex: number;
  total: number;
}
interface ProviderColorType extends PastelColorType {
  name: string;
}

export const getPastelColor = ({ currentIndex, total }: PastelColorType) => {
  const colors = (260 / total).toFixed();

  const pastelColor =
    total === 1 ? '#3d5170' : `hsl(${currentIndex * Number(colors)},50%,50%)`;

  return pastelColor;
};

export const getProviderColor = ({
  name,
  currentIndex,
  total
}: ProviderColorType) => {
  if (Object.keys(DEFAULT_PROVIDER_COLORS).includes(name)) {
    return DEFAULT_PROVIDER_COLORS[name];
  }
  return getPastelColor({ currentIndex, total });
};
