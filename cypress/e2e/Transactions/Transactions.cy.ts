import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../../constants/enums';
describe('Transactions', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.links > [href="/transactions"]').click();
    cy.checkUrl(RoutesEnum.transactions);
  });
  it('should display de header elements', () => {
    cy.contains('Transactions');
    cy.contains('Total Accounts');
    cy.contains('Block Height');
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
    cy.paginationHandler();
    cy.checkUrl(RoutesEnum.transactions);
    cy.apiIntercept(ApiMethodsEnum.GET, `${ApiEndpointsEnum.transactions}/`);
    cy.get('[aria-label="Last Page"]').first().click();
    cy.verifyApiResponse(`${ApiEndpointsEnum.transactions}/`);
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
