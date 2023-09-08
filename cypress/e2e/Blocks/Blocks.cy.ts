import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../../constants/enums';

describe('Blocks', () => {
  beforeEach(() => {
    cy.accesPage(RoutesEnum.blocks);
  });

  it('should display de header elements', () => {
    cy.checkHeaderElements('Blocks');
    cy.checkUrl(RoutesEnum?.blocks);
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
    cy.paginationHandler(RoutesEnum.blocks);
  });
  it('should acces the block details page', () => {
    cy.viewport(1000, 3000);
    cy.getSelector('blockLink11').click();
    cy.getSelector('title').should(AssertionEnum.contain, 'Block Details');
  });
});
