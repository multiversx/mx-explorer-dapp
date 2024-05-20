import { itCH } from 'date-fns/locale';
import { AssertionEnum, RoutesEnum } from '../../constants/enums';

describe('Validators', () => {
  beforeEach(() => {
    cy.accesPage(RoutesEnum.nodes);
  });
  it('should properly display the table', () => {
    const tableHead = [
      'Public Key',
      'Name',
      'Shard',
      'Version',
      'Status',
      'X Sign.',
      'Rating',
      'Nonce'
    ];
    cy.checkTableHead(tableHead);
  });
  it('should properly change the table page', () => {
    cy.paginationHandler(RoutesEnum.nodes);
  });

  it('should acces the validator details page', () => {
    cy.get('header').invoke('css', {
      display: 'none'
    });
    cy.contains('a', 'Staking Providers').click();
    cy.checkUrl('providers');
    cy.getSelector('providerLink0').click();
    cy.contains('Contract Details');
    cy.getSelector('title').should(AssertionEnum.contain, 'Contract Details');
  });
});
