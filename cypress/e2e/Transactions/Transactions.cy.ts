import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../../constants/enums';
describe('Transactions', () => {
  beforeEach(() => {
    cy.accesPage(RoutesEnum.transactions);
  });
  it('should display de header elements', () => {
    cy.checkHeaderElements('Transactions');
    cy.getSelector('title').should(AssertionEnum.contain, 'Live Transactions');
  });

  it('should properly display the table', () => {
    const tableHead = [
      'Txn Hash',
      'Age',
      'Shard',
      'From',
      'To',
      'Method',
      'Value'
    ];
    cy.checkTableHead(tableHead);
  });

  it('should properly change the table page', () => {
    cy.paginationHandler(RoutesEnum.transactions);
  });

  it('should acces the transaction details page', () => {
    cy.viewport(2000, 3000);
    cy.getSelector('transactionLink').first().click();
    cy.getSelector('title').should(
      AssertionEnum.contain,
      'Transaction Details'
    );
  });
});
