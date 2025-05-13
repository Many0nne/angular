describe('Test de navigation vers le profil', () => {
  it('Devrait permettre à l\'utilisateur de naviguer vers son compte', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('cypress@cypress.com');
    cy.get('input[name="password"]').type('cypress');
    cy.get('button[type="submit"]').click();
    cy.visit('/account');
    cy.get('h1').should('contain', 'test');
  });
});
