describe('Test d\'ajout d\'ami', () => {
  it('Devrait envoyer une demande d\'ami', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('testE2E@testE2E.com');
    cy.get('input[name="password"]').type('testE2E');
    cy.get('button[type="submit"]').click();
    cy.get('a[href="/account"]').click();
    cy.get('select').find('option').should('have.length.greaterThan', 1);
    cy.get('select').select('testE2E (testE2E@testE2E.com)');
    cy.get('button').contains('Envoyer').click();
    cy.visit('/account');
    cy.get('h2').contains('Demandes d\'Amis').parent().find('ul > li').should('have.length.greaterThan', 0);
  });
});
