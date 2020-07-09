import { fireEvent, renderWithRouter, config } from './../../../utils/test-utils';

let optionalConfig = { ...config };
optionalConfig.testnets.push({
  default: false,
  id: 'testnet-do-toronto',
  name: 'DigitalOcean TOR Testnet',
  numInitCharactersForScAddress: 20,
  nodeUrl: '***REMOVED***',
  refreshRate: 6000,
  elasticUrl: '***REMOVED***',
  decimals: 4,
  denomination: 18,
  gasPrice: 200000000000,
  gasLimit: 50000,
  gasPerDataByte: 1500,
  gasLimitEditable: true,
  economics: true,
  data: true,
  wallet: true,
  validatorDetails: true,
  faucet: false,
  validatorsApiUrl: 'https://api.elrond.com',
  nrOfShards: 5,
  versionNumber: 'v1.0.123',
});

describe('Testnet Router', () => {
  test('Change route on testnet change', async () => {
    const render = renderWithRouter({
      route: '/',
      optionalConfig,
    });
    const testnetSwitch = render.getByTestId('testnetSwitch');
    expect(testnetSwitch.textContent).toBe('Battle of Nodes ');
    fireEvent.click(testnetSwitch);
    const digitalOcean = render.getByText('DigitalOcean TOR Testnet');
    fireEvent.click(digitalOcean);
    expect(render.history.location.pathname).toBe('/testnet-do-toronto');
  });
});
