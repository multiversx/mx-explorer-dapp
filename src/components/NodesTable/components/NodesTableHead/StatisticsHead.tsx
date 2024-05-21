import { Sort, Overlay } from 'components';

export const StatisticsHead = () => {
  return (
    <thead>
      <tr>
        <th scope='col' data-testid='node'>
          Public Key
        </th>
        <th scope='col' data-testid='name'>
          <Sort id='name' text='Name' />
        </th>

        <th scope='col' data-testid='leaderSuccess'>
          <Sort id='leaderSuccess' text='Leader Success' />
        </th>
        <th scope='col' data-testid='leaderFailure'>
          <Sort id='leaderFailure' text='Leader Failure' />
        </th>
        <th scope='col' data-testid='validatorSuccess'>
          <Sort id='validatorSuccess' text='Validator Success' />
        </th>
        <th scope='col' data-testid='validatorFailure'>
          <Sort id='validatorFailure' text='Validator Failure' />
        </th>
        <th scope='col' data-testid='validatorIgnoredSignatures'>
          <Sort
            id='validatorIgnoredSignatures'
            text={<Overlay title='Ignored Signatures'>X Sign.</Overlay>}
          />
        </th>
        <th scope='col' data-testid='tempRating'>
          <Sort id='tempRating' text='Temp Rating' />
        </th>
      </tr>
    </thead>
  );
};
