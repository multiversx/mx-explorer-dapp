import { AssertionError } from 'chai';
import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../../constants/enums';

describe('Blocks', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.links > [href="/blocks"]').click();
    cy.checkUrl(RoutesEnum.blocks);
  });

  it('should display de header elements', () => {
    cy.contains('Blocks');
    cy.contains('Total Accounts');
    cy.contains('Block Height');
  });

  it('should properly display the table', () => {
    const tableHead = [
      'Block',
      'Age',
      'Txns',
      'Shard',
      'Size',
      'Gas Used',
      'Block Hash',
      'Leader'
    ];
    cy.checkTableHead(tableHead);
  });
  it('should properly change the table page', () => {
    cy.paginationHandler();
    cy.checkUrl(RoutesEnum.blocks);
    cy.apiIntercept(ApiMethodsEnum.GET, `${ApiEndpointsEnum.blocks}/`);
    cy.get('[aria-label="Last Page"]').first().click();
    cy.verifyApiResponse(`${ApiEndpointsEnum.blocks}/`);
  });
  it('should acces the block details page', () => {
    cy.viewport(1000, 3000);
    cy.getSelector('blockLink11').click();
    cy.getSelector('title').should(AssertionEnum.contain, 'Block Details');
  });
});
