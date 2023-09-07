import BigNumber from 'bignumber.js';
import { SearchDataEnums } from './enums';
import { searchHandler } from './helpers';

import {
  ApiEndpointsEnum,
  ApiMethodsEnum,
  RoutesEnum
} from '../../constants/enums';
describe('Search', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.apiIntercept(ApiMethodsEnum.GET, ApiEndpointsEnum.accounts);
    cy.apiIntercept(ApiMethodsEnum.GET, `${ApiEndpointsEnum.blocks}/`);
    cy.apiIntercept(ApiMethodsEnum.GET, ApiEndpointsEnum.collections);
    cy.apiIntercept(ApiMethodsEnum.GET, ApiEndpointsEnum.tokens);
    cy.apiIntercept(ApiMethodsEnum.GET, ApiEndpointsEnum.nodes);
  });
  it('should return Your search does not match anything', () => {
    searchHandler('no validators with this');
    cy.contains('Your search does not match anything');
  });

  it('should return the account details page', () => {
    let balance: string;
    searchHandler(SearchDataEnums.address);
    cy.contains('Address Details');
    cy.checkUrl(RoutesEnum.accounts);
    cy.verifyApiResponse(ApiEndpointsEnum.accounts, (xhr) => {
      expect(xhr?.response.body.address).to.eq(SearchDataEnums.address);
      const amount = xhr?.response.body.balance;
      balance = new BigNumber(amount)
        .dividedBy('1000000000000000000')
        .toFixed(4);
    }).then(() => {
      cy.getSelector('balance').first().should('contain', balance, 'xEGLD');
    });
  });

  it('should return the block hash details page', () => {
    searchHandler(SearchDataEnums.blockHash);
    cy.checkUrl(RoutesEnum.blocks);
    cy.contains('Block Details');
    cy.verifyApiResponse(`${ApiEndpointsEnum.blocks}/`, (xhr) => {
      expect(xhr?.response.body.hash).to.eq(SearchDataEnums.blockHash);
    });
  });

  it('should return the collection details page ', () => {
    searchHandler(SearchDataEnums.collectionName);
    cy.checkUrl(RoutesEnum.collections);
    cy.contains('Collection Details');
    cy.verifyApiResponse(ApiEndpointsEnum.collections, (xhr) => {
      expect(xhr?.response.body.collection).to.eq(
        SearchDataEnums.collectionName
      );
    });
  });
  it('should return the token details page', () => {
    searchHandler(SearchDataEnums.token);
    cy.checkUrl(RoutesEnum.tokens);
    cy.contains('ASH Token');
    cy.verifyApiResponse(ApiEndpointsEnum.tokens, (xhr) => {
      expect(xhr?.response.body.identifier).to.eq(SearchDataEnums.token);
    });
  });

  it('should return the validator key page', () => {
    searchHandler(SearchDataEnums.validatorKey);
    cy.checkUrl(RoutesEnum.nodes);
    cy.contains('Node Details');
    cy.verifyApiResponse(ApiEndpointsEnum.nodes);
  });
});
