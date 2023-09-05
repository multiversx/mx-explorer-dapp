import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../../constants/enums';
describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.apiIntercept(ApiMethodsEnum.GET, ApiEndpointsEnum.blocks);
    cy.apiIntercept(ApiMethodsEnum.GET, ApiEndpointsEnum.transactions);
    cy.apiIntercept(ApiMethodsEnum.GET, ApiEndpointsEnum.stats);
  });

  it('should successfully return the API responses', () => {
    cy.verifyApiResponse(ApiEndpointsEnum.blocks, (xhr) => {
      expect(xhr?.response?.body).to.have.lengthOf(5);
    });
    cy.verifyApiResponse(ApiEndpointsEnum.transactions, (xhr) => {
      expect(xhr?.response?.body).to.have.lengthOf(5);
    });
    cy.verifyApiResponse(ApiEndpointsEnum.stats, (xhr) => {
      expect(xhr?.response?.body?.accounts).to.be.at.least(3200);
      expect(xhr?.response?.body?.scResults).to.be.at.least(191275);
      expect(xhr?.response?.body?.blocks).to.be.at.least(14078875);
      expect(xhr?.response?.body?.epoch).to.be.at.least(2947);
      expect(xhr?.response?.body?.shards).to.be.at.least(3);
    });
  });
  it('should successfully display the DOM elements', () => {
    cy.get('h1').should(
      AssertionEnum.contain,
      'MultiversX Blockchain Testnet Explorer'
    );
    cy.getSelector('blocksList').should(AssertionEnum.exist);
    cy.getSelector('transactionsList').should(AssertionEnum.exist);
    cy.get('a:contains("View All")')
      .should('have.attr', 'href')
      .and(AssertionEnum.include, RoutesEnum.blocks);
    cy.get('a:contains("View All")')
      .last()
      .should('have.attr', 'href')
      .and(AssertionEnum.include, RoutesEnum.transactions);
  });
});
