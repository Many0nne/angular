describe('Test de gestion des demandes d\'amis', () => {
  it('Devrait accepter une demande d\'ami', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('testE2E@testE2E.com');
    cy.get('input[name="password"]').type('testE2E');
    cy.get('button[type="submit"]').click();
    cy.get('a[href="/account"]').click();
    cy.contains('testE2E (testE2E@testE2E.com)').parent().find('button').contains('Accepter').click();
    cy.get('h2').contains('Mes Amis').parent().find('.grid > div').should('have.length.greaterThan', 0);
  });
});
