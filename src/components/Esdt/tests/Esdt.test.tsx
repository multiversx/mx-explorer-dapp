import { fireEvent, wait, beforeAll } from 'utils/test-utils';

describe('Esdt Page', () => {
  test('Esdt page is displaying', async () => {
    const render = beforeAll({
      route: '/esdt',
    });

    expect(document.title).toEqual('ESDT • Elrond Explorer');

    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('ESDT');
      const table = await render.findByTestId('esdtTable');
      expect(table.childElementCount).toBe(1);
    });
  });

  test('Esdt page loading state', async () => {
    const render = beforeAll({
      route: '/esdt',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Esdt page failed state', async () => {
    const render = beforeAll({
      route: '/esdt',
      networkRequests: {
        esdt: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByTestId('errorScreen');
    expect(failedState.innerHTML).toBeDefined();
  });
});

// describe('Esdt Page Links', () => {
//   test('Esdt page link', async () => {
//     const render = beforeAll({
//       route: '/esdt',
//     });

//     const link = await render.findByTestId('esdtLink0');
//     expect(link.textContent).toBe(
//       'erd1sea63y47u569ns3x5mqjf4vnygn...9whkk7p6ry4rfpqyd6rd5addqyd9lf2'
//     );

//     fireEvent.click(link);
//     await wait(async () => {
//       expect(document.title).toEqual('Esdt Details • Elrond Explorer');
//     });
//   });
// });
