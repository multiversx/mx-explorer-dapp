import { AssertionEnum } from '../constants/enums';
import { TESTNET_API } from '../constants/globalLinks';

// Check the url global function
Cypress.Commands.add('checkUrl', (url) => {
  cy.url().should(AssertionEnum.include, url);
});

// Add the custom command for api intercepts
Cypress.Commands.add('apiIntercept', (method, param) => {
  cy.intercept(method, `${TESTNET_API}${param}*`).as(param);
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