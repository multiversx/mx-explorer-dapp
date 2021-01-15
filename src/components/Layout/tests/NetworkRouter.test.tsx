import { fireEvent, beforeAll, wait } from 'utils/test-utils';
import { ConfigType } from 'context/state';

const optionalConfig: ConfigType = {
  links: [],
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
      apiUrl: 'https://api.elrond.com',
      adapter: 'api',
      erdLabel: 'EGLD',
    },
  ],
};

describe('Network Router', () => {
  test('Change route on network change', async () => {
    const render = beforeAll({
      route: '/',
      optionalConfig,
    });
    const networkSwitch = render.getAllByTestId('networkSwitch');
    expect(networkSwitch[0].textContent).toBe('Zero to One');
    fireEvent.click(networkSwitch[0]);
    const digitalOcean = render.getByText('DigitalOcean TOR Testnet');
    fireEvent.click(digitalOcean);
    await wait(async () => {
      expect(render.history.location.pathname).toBe('/testnet-do-toronto');
    });
  });
});
