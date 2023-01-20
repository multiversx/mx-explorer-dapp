interface PastelColorType {
  currentIndex: number;
  total: number;
}
interface ProviderColorType extends PastelColorType {
  name: string;
}

const DEFAULT_PROVIDER_COLORS: {
  [index: string]: string;
} = {
  multiversx: '#23f7dd',
  binance_staking: '#f2b92e',
  justminingfr: '#f99a28',
  validblocks: '#5e20e5',
  arcstake: '#c816cc',
  moonlorianstake: '#6c4c59',
  sikka_tech: '#ffbe00',
  rosettastake: '#1aaefb',
  middlestakingfr: '#5485a9',
};

const getPastelColor = ({ currentIndex, total }: PastelColorType) => {
  const colors = (260 / total).toFixed();

  const pastelColor = total === 1 ? '#3d5170' : `hsl(${currentIndex * Number(colors)},50%,50%)`;

  return pastelColor;
};

const getProviderColor = ({ name, currentIndex, total }: ProviderColorType) => {
  if (Object.keys(DEFAULT_PROVIDER_COLORS).includes(name)) {
    return DEFAULT_PROVIDER_COLORS[name];
  }
  return getPastelColor({ currentIndex, total });
};

export default getProviderColor;
