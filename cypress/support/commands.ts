import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  AssertionEnum,
  RoutesEnum
} from '../constants/enums';
import { DEVNET_API } from '../constants/globalLinks';

// Check the url global function
Cypress.Commands.add('checkUrl', (url) => {
  cy.url().should(AssertionEnum.include, url);
});

// Add the custom command for api intercepts
Cypress.Commands.add('apiIntercept', (method, param) => {
  cy.intercept(method, `${DEVNET_API}${param}*`).as(param);
});
//Login with keystore global function
Cypress.Commands.add('getSelector', (selector, ...cypressAction) => {
  return cy.get(`[data-testid=${selector}]`, ...cypressAction);
});

Cypress.on('uncaught:exception', () => {
  // Do nothing or handle the exception as per your requirements
  // You can remove the comment and add your custom handling logic here
  // console.log('An uncaught exception occurred but will be ignored');
  return false; // Prevent Cypress from failing the test
});

Cypress.Commands.add('verifyApiResponse', (alias, ...additionalExpects) => {
  cy.wait(`@${alias}`).then((xhr) => {
    expect(xhr?.response?.statusCode).to.eq(200);
    expect(xhr?.response?.statusMessage).to.eq('OK');

    // Perform additional assertions passed as parameters
    if (additionalExpects.length > 0) {
      additionalExpects.forEach((expectation) => {
        expectation(xhr);
      });
    }
  });
});
Cypress.Commands.add('coveredElementHandler', (selector) => {
  cy.getSelector(selector).invoke('css', {
    paddingTop: '10rem'
  });
});

Cypress.Commands.add('paginationHandler', (route) => {
  cy.get('header').invoke('css', {
    display: 'none'
  });
  cy.contains('button', '2').click();
  cy.checkUrl('page=2');
  cy.contains('button', '3').click();
  cy.checkUrl('page=3');
  cy.contains('button', '1').click();
  cy.contains('button', 'Next').last().click();
  cy.checkUrl('page=2');
  cy.contains('button', 'Prev').click();
  cy.checkUrl(route);
  cy.apiIntercept(ApiMethodsEnum.GET, `${route}/`);
  cy.get('[aria-label="Last Page"]').first().click();
  cy.verifyApiResponse(`${route}/`);
});

Cypress.Commands.add('checkTableHead', (payload: string[]) => {
  payload.forEach((el, index) => {
    cy.get(`thead > tr > :nth-child(${index + 1})`).should(
      AssertionEnum.contain,
      el
    );
  });
});

Cypress.Commands.add('checkHeaderElements', (payload: string) => {
  cy.contains(payload);
  cy.contains('Total Accounts');
  cy.contains('Total Transactions');
  cy.contains('Block Height');
});

Cypress.Commands.add('accesPage', (page: string) => {
  cy.visit('/');
  cy.get(`.links .link[href="${page}"]`).click();
  cy.checkUrl(page);
});
