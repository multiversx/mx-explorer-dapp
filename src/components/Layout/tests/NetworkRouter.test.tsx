import { fireEvent, renderWithRouter } from 'utils/test-utils';
import { ConfigType } from 'context/state';

const optionalConfig: ConfigType = {
  networks: [
    {
      default: true,
      id: 'zero-to-one',
      name: 'Zero to One',
      apiUrl: 'https://api.elrond.com',
      adapter: 'api',
      erdLabel: 'EGLD',
    },
    {
      default: false,
      id: 'testnet-do-toronto',
      name: 'DigitalOcean TOR Testnet',
      proxyUrl: '***REMOVED***',
      elasticUrl: '***REMOVED***',
      adapter: 'elastic',
      validatorDetails: true,
      erdLabel: 'EGLD',
    },
  ],
};

describe('Network Router', () => {
  test('Change route on network change', async () => {
    const render = renderWithRouter({
      route: '/',
      optionalConfig,
    });
    const networkSwitch = render.getAllByTestId('networkSwitch');
    expect(networkSwitch[0].textContent).toBe('Zero to One ');
    fireEvent.click(networkSwitch[0]);
    const digitalOcean = render.getByText('DigitalOcean TOR Testnet');
    fireEvent.click(digitalOcean);
    expect(render.history.location.pathname).toBe('/testnet-do-toronto');
  });
});
