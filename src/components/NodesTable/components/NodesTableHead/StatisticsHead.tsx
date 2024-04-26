import { Sort, Overlay } from 'components';

export const StatisticsHead = () => {
  return (
    <tr>
      <th data-testid='node'>Public Key</th>
      <th data-testid='name'>
        <Sort id='name' text='Name' />
      </th>

      <th data-testid='leaderSuccess'>
        <Sort id='leaderSuccess' text='Leader Success' />
      </th>
      <th data-testid='leaderFailure'>
        <Sort id='leaderFailure' text='Leader Failure' />
      </th>
      <th data-testid='validatorSuccess'>
        <Sort id='validatorSuccess' text='Validator Success' />
      </th>
      <th data-testid='validatorFailure'>
        <Sort id='validatorFailure' text='Validator Failure' />
      </th>
      <th data-testid='validatorIgnoredSignatures'>
        <Sort
          id='validatorIgnoredSignatures'
          text={<Overlay title='Ignored Signatures'>X Sign.</Overlay>}
        />
      </th>
      <th data-testid='tempRating'>
        <Sort id='tempRating' text='Temp Rating' />
      </th>
    </tr>
  );
};
