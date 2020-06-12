import React from 'react';
import { render } from '@testing-library/react';
import Rounds from './../Rounds';

describe('Rounds', () => {
  test('Rounds loading state', async () => {
    const methods = render(<Rounds rounds={[]} roundsFetched={true} isWaiting={false} />);
    expect(methods.getByTestId('roundsLoading')).toBeDefined();
  });
  test('Rounds failed state', async () => {
    const methods = render(<Rounds rounds={[]} roundsFetched={false} isWaiting={false} />);
    expect(methods.getByTestId('roundsErrorScreen')).toBeDefined();
  });
});
