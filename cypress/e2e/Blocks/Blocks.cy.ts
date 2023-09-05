import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  RoutesEnum
} from '../../constants/enums';

describe('Blocks', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.links > [href="/blocks"]').click();
    cy.checkUrl(RoutesEnum.blocks);
  });

  it('should', () => {});
});
