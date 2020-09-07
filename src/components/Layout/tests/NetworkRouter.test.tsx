import { fireEvent, renderWithRouter } from 'utils/test-utils';
import { ConfigType } from 'context/state';

const optionalConfig: ConfigType = {
  metaChainShardId: 4294967295,
  erdLabel: 'eGLD',
  secondary: false,
  elrondApps: [
    {
      id: 'wallet',
      name: 'Wallet',
      to: 'https://wallet.elrond.com/',
    },
    {
      id: 'explorer',
      name: 'Explorer',
      to: 'https://explorer.elrond.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      to: 'https://docs.elrond.com/',
    },
  ],
  explorerApi: '',
  networks: [
    {
      default: true,
      id: 'zero-to-one',
      name: 'Zero to One',
      apiUrl: 'https://api.elrond.com',
      adapter: 'api',
      refreshRate: 6000,
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 18,
      gasPrice: 100000000000000,
      gasLimit: 1000000,
      gasPerDataByte: 1500,
      validatorDetails: true,
      nrOfShards: 1,
      versionNumber: '2',
      fetchedFromNetworkConfig: true,
    },
    {
      default: false,
      id: 'testnet-do-toronto',
      name: 'DigitalOcean TOR Testnet',
      proxyUrl: '***REMOVED***',
      elasticUrl: '***REMOVED***',
      adapter: 'elastic',
      refreshRate: 6000,
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 18,
      gasPrice: 100000000000000,
      gasLimit: 1000000,
      gasPerDataByte: 1500,
      validatorDetails: true,
      nrOfShards: 1,
      versionNumber: '2',
      fetchedFromNetworkConfig: true,
    },
  ],
};

describe('Network Router', () => {
  test('Change route on network change', async () => {
    const render = renderWithRouter({
      route: '/',
      optionalConfig,
    });
    const networkSwitch = render.getByTestId('networkSwitch');
    expect(networkSwitch.textContent).toBe('Zero to One ');
    fireEvent.click(networkSwitch);
    const digitalOcean = render.getByText('DigitalOcean TOR Testnet');
    fireEvent.click(digitalOcean);
    expect(render.history.location.pathname).toBe('/testnet-do-toronto');
  });
});
