import { fireEvent, renderWithRouter } from 'utils/test-utils';
import { ConfigType } from 'context/state';

const optionalConfig: ConfigType = {
  metaChainShardId: 4294967295,
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
  testnets: [
    {
      default: true,
      id: 'zero-to-one',
      name: 'Zero to One',
      nodeUrl: 'https://api.elrond.com',
      elasticUrl: 'https://api-facade.elrond.com',
      refreshRate: 6000,
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 18,
      gasPrice: 100000000000000,
      gasLimit: 1000000,
      gasPerDataByte: 1500,
      validatorDetails: true,
      faucet: false,
      nrOfShards: 1,
      versionNumber: '2',
      fetchedFromNetworkConfig: true,
    },
    {
      default: false,
      id: 'testnet-do-toronto',
      name: 'DigitalOcean TOR Testnet',
      nodeUrl: '***REMOVED***',
      elasticUrl: '***REMOVED***',
      refreshRate: 6000,
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 18,
      gasPrice: 100000000000000,
      gasLimit: 1000000,
      gasPerDataByte: 1500,
      validatorDetails: true,
      faucet: false,
      nrOfShards: 1,
      versionNumber: '2',
      fetchedFromNetworkConfig: true,
    },
  ],
};

describe('Testnet Router', () => {
  test('Change route on testnet change', async () => {
    const render = renderWithRouter({
      route: '/',
      optionalConfig,
    });
    const testnetSwitch = render.getByTestId('testnetSwitch');
    expect(testnetSwitch.textContent).toBe('Zero to One ');
    fireEvent.click(testnetSwitch);
    const digitalOcean = render.getByText('DigitalOcean TOR Testnet');
    fireEvent.click(digitalOcean);
    expect(render.history.location.pathname).toBe('/testnet-do-toronto');
  });
});
