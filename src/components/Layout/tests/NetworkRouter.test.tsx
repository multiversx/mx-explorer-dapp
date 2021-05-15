import { fireEvent, beforeAll, wait, act } from 'utils/test-utils';
import { ConfigType } from 'context/state';

const optionalConfig: ConfigType = {
  links: [],
  elrondApps: [
    {
      id: 'explorer',
      name: 'Explorer', // navbar title
      url: 'https://explorer.elrond.com/',
    },
  ],
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
    let networkSwitch = render.getAllByTestId('networkSwitch');
    expect(networkSwitch[0].textContent).toBe('Zero to One');
    fireEvent.click(networkSwitch[0]);

    await act(async () => {
      render.history.push(`${render.history.location.pathname}testnet-do-toronto`);

      await wait(async () => {
        let networkSwitch = render.getAllByTestId('networkSwitch');
        expect(networkSwitch[0].textContent).toBe('DigitalOcean TOR Testnet');

        expect(render.history.location.pathname).toBe('/testnet-do-toronto');
      });
    });
  }, 10000);
});
