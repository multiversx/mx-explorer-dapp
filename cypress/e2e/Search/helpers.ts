import { SearchSelectorsEnum } from './enums';

export const searchHandler = (input: string) => {
  cy.coveredElementHandler('search');
  cy.getSelector(SearchSelectorsEnum.search).type(input);
  cy.getSelector(SearchSelectorsEnum.searchButton).click();
};
