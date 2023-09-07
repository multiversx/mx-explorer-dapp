import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../../constants/enums';
describe('Accounts', () => {
  beforeEach(() => {
    cy.accesPage(RoutesEnum.accounts);
  });
  it('should properly display the header elements', () => {
    cy.checkHeaderElements('Accounts');
  });

  it('should properly display the table', () => {
    const tableHead = ['Address', 'Balance'];
    cy.checkTableHead(tableHead);
  });

  it('should properly change the table page', () => {
    cy.paginationHandler(RoutesEnum.accounts);
  });

  it('should acces the account details page', () => {
    cy.viewport(1000, 3000);
    cy.get('td').first().click();
    cy.getSelector('title').should(AssertionEnum.contain, 'Address Details');
  });
});
