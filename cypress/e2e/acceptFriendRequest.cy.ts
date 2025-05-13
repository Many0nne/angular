describe('Test de gestion des demandes d\'amis', () => {
  it('Devrait accepter une demande d\'ami', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('cypress@cypress.com');
    cy.get('input[name="password"]').type('cypress');
    cy.get('button[type="submit"]').click();
    cy.get('a[href="/account"]').click();
    cy.contains('bbb (bbb@bbb.com)').parent().find('button').contains('Accepter').click();
    cy.get('h2').contains('Mes Amis').parent().find('.grid > div').should('have.length.greaterThan', 0);
  });
});
