import React from 'react';
import config from 'utils/config';
import Denominate from '../index';
import { GlobalProvider } from 'context';
import { render } from '@testing-library/react';

const renderComponent = (props: any) => {
  const methods = render(
    <GlobalProvider optionalConfig={config}>
      <Denominate {...props} />
    </GlobalProvider>
  );

  return methods.getByTestId(`denominateComponent`);
};

describe('Denominate component when decimals = 2', () => {
  it(`should show 2 non zero decimals `, async () => {
    const props = {
      value: '9999979999800000000000000',
      showLastNonZeroDecimal: false,
      showErd: true,
      decimals: 2,
    };

    const component = renderComponent(props);
    expect(component.getElementsByClassName('decimals')[0].textContent).toBe('.99');
  });

  it(`should show 2 zero decimals`, async () => {
    const props = {
      value: '9000000000000000000000000',
      showLastNonZeroDecimal: false,
      showErd: true,
      decimals: 2,
    };

    const component = renderComponent(props);
    expect(component.getElementsByClassName('decimals')[0].textContent).toBe('.00');
  });

  it(`should show all non zero decimals when showLastNonZeroDecimal = true`, async () => {
    const props = {
      value: '100000000000000',
      showLastNonZeroDecimal: true,
      showErd: false,
      decimals: 2,
    };

    const component = renderComponent(props);
    expect(component.getElementsByClassName('decimals')[0].textContent).toBe('.0001');
  });

  it(`should not show decimals when value is 0`, async () => {
    const props = {
      value: '100000000000000',
      showLastNonZeroDecimal: false,
      showErd: true,
      decimals: 2,
    };

    const component = renderComponent(props);
    expect(component.getElementsByClassName('decimals').length).toBe(0);
  });

  it(`should show symbol`, async () => {
    const props = {
      value: '9000000000000000000000000',
      showLastNonZeroDecimal: false,
      showErd: true,
      decimals: 2,
    };

    const component = renderComponent(props);
    expect(component.getElementsByClassName('symbol').length).toBe(1);
  });

  it(`should not show symbol`, async () => {
    const props = {
      value: '9000000000000000000000000',
      showLastNonZeroDecimal: false,
      showErd: false,
      decimals: 2,
    };

    const component = renderComponent(props);
    expect(component.getElementsByClassName('symbol').length).toBe(0);
  });
});
