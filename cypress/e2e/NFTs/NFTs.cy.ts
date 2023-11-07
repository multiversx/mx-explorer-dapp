import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../../constants/enums';

describe('NFTs', () => {
  beforeEach(() => {
    cy.accesPage(RoutesEnum.collections);
  });
  it('should display de header elements', () => {
    cy.checkHeaderElements('collections');
    cy.checkUrl(RoutesEnum?.collections);
  });

  it('should properly display the table', () => {
    const tableHead = [
      'Collection',
      'Name',
      'Age',
      'Items',
      'Holders',
      'Owner'
    ];
    cy.checkTableHead(tableHead);
  });

  it('should properly change the table page', () => {
    cy.paginationHandler(RoutesEnum.collections);
  });

  it('should acces the nft details page', () => {
    cy.viewport(1000, 3000);
    cy.getSelector('collectionLink1').click();
    cy.getSelector('title').should(AssertionEnum.contain, 'Collection Details');
  });
});
