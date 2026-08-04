/// <reference types="cypress" />

// cursor requests take longer
const CURSOR_TIMEOUT = 15000;

const firstTxHash = () =>
  cy
    .get('[data-testid="transactionLink"]', { timeout: CURSOR_TIMEOUT })
    .first()
    .invoke('text');

const visitTransactions = (query: string) => {
  cy.intercept('GET', 'https://devnet-api.multiversx.com/transactions?*').as(
    'txs'
  );
  cy.visit(`/devnet/transactions${query}`);
};

describe('searchAfter cursor pagination', () => {
  it('keeps offset pagination below the ceiling and sends no cursor', () => {
    visitTransactions('?page=399');

    cy.wait('@txs').then(({ request }) => {
      expect(request.url).to.include('from=9950');
      expect(request.url).to.not.include('searchAfter=');
    });
  });

  it('crosses the wall: page 400 Next hands off to a cursor', () => {
    visitTransactions('?page=400');

    // the last offset page: from + size = 10000
    cy.wait('@txs').its('request.url').should('include', 'from=9975');
    cy.get('[data-testid="transactionsTable"] tr').should('have.length.gt', 1);

    // the cursor is already in hand at the wall, so 401 is a live page button
    cy.get('[aria-label="401st Page"]').first().should('not.be.disabled');

    firstTxHash().then((hashAtWall) => {
      cy.get('[data-testid="nextPageButton"]').first().click();

      cy.url().should('include', 'page=401');
      cy.url().should('include', 'searchAfter=');

      // a cursor request carrying `from` is a 400 from the api
      cy.wait('@txs').then(({ request }) => {
        expect(request.url).to.include('searchAfter=');
        expect(request.url).to.not.include('from=');
      });

      // page 401 must be new rows, not a repeat of the wall or of page 1
      firstTxHash().should('not.equal', hashAtWall);
    });
  });

  it('walks forward then back across cursor pages', () => {
    visitTransactions('?page=400');
    cy.wait('@txs');

    cy.get('[data-testid="nextPageButton"]').first().click();
    cy.url().should('include', 'page=401');
    cy.wait('@txs');

    firstTxHash().then((hashAt401) => {
      cy.get('[data-testid="nextPageButton"]').first().click();
      cy.url().should('include', 'page=402');
      cy.wait('@txs', { timeout: CURSOR_TIMEOUT });
      firstTxHash().should('not.equal', hashAt401);

      // back to 401 using the cursor remembered on the way out
      cy.get('[data-testid="previousPageButton"]').first().click();
      cy.url().should('include', 'page=401');
      cy.wait('@txs', { timeout: CURSOR_TIMEOUT });
      firstTxHash().should('equal', hashAt401);
    });
  });

  it('drops the cursor when stepping back below the ceiling', () => {
    visitTransactions('?page=400');
    cy.wait('@txs');
    cy.get('[data-testid="nextPageButton"]').first().click();
    cy.wait('@txs');

    cy.get('[data-testid="previousPageButton"]').first().click();
    cy.url().should('include', 'page=400');
    cy.url().should('not.include', 'searchAfter');

    cy.wait('@txs').then(({ request }) => {
      expect(request.url).to.include('from=9975');
      expect(request.url).to.not.include('searchAfter=');
    });
  });

  it('snaps back when the api ignores the cursor and serves page 1 anyway', () => {
    visitTransactions('?page=400');
    cy.wait('@txs');

    const cursorlessBody = Array.from({ length: 25 }, (_, index) => ({
      txHash: `${index}`.padStart(64, 'a'),
      sender: 'erd1qqqqqqqqqqqqqpgqvg8r5yavkyhu6rmmkgqzgsduzheg2fk7v5ysrypdex',
      receiver:
        'erd1qqqqqqqqqqqqqpgqvg8r5yavkyhu6rmmkgqzgsduzheg2fk7v5ysrypdex',
      senderShard: 1,
      receiverShard: 1,
      status: 'success',
      value: '0',
      timestamp: 1783695296,
      round: 1
    }));

    cy.intercept(
      'GET',
      'https://devnet-api.multiversx.com/transactions?*searchAfter*',
      { statusCode: 200, body: cursorlessBody }
    ).as('blindTxs');

    cy.get('[data-testid="nextPageButton"]').first().click();

    cy.wait('@blindTxs');
    cy.url().should('not.include', 'page=401');
    cy.url().should('include', 'page=400');
    cy.url().should('not.include', 'searchAfter');
  });

  it('crosses the wall on blocks too', () => {
    cy.intercept('GET', 'https://devnet-api.multiversx.com/blocks?*').as(
      'blocks'
    );
    cy.visit('/devnet/blocks?page=400');
    cy.wait('@blocks').its('request.url').should('include', 'from=9975');

    cy.get('[data-testid="blockLink0"]')
      .invoke('text')
      .then((nonceAtWall) => {
        cy.get('[data-testid="nextPageButton"]').first().click();

        cy.url().should('include', 'page=401');
        cy.wait('@blocks').then(({ request }) => {
          expect(request.url).to.include('searchAfter=');
          expect(request.url).to.not.include('from=');
        });

        cy.get('[data-testid="blockLink0"]')
          .invoke('text')
          .should('not.equal', nonceAtWall);
      });
  });

  it('crosses the wall on accounts too', () => {
    cy.intercept('GET', 'https://devnet-api.multiversx.com/accounts?*').as(
      'accounts'
    );
    cy.visit('/devnet/accounts?page=400');
    cy.wait('@accounts').its('request.url').should('include', 'from=9975');

    const firstAddress = () =>
      cy
        .get('[data-testid="accountsTable"] tr', { timeout: CURSOR_TIMEOUT })
        .first()
        .invoke('text');

    firstAddress().then((addressAtWall) => {
      cy.get('[data-testid="nextPageButton"]').first().click();

      cy.url().should('include', 'page=401');
      cy.wait('@accounts').then(({ request }) => {
        expect(request.url).to.include('searchAfter=');
        expect(request.url).to.not.include('from=');
      });

      firstAddress().should('not.equal', addressAtWall);
    });
  });

  it('ignores a cursor left in the url once page falls back below the ceiling', () => {
    // clear cursor
    visitTransactions(
      '?searchAfter=WzE3ODE4NjM2NzYwMDAsMTc4MTg2MzY3NjAwMCw0MTk4OSwiMktmVW5iMF9RdnVPQVlYaTIyWlRIZz09Il0='
    );

    cy.wait('@txs').then(({ request }) => {
      expect(request.url).to.include('from=0');
      expect(request.url).to.not.include('searchAfter=');
    });
  });
});
