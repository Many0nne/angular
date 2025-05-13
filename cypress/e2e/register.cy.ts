describe('Test d\'inscription', () => {
  it('Devrait inscrire un utilisateur et rediriger vers la page de connexion', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('cypress');
    cy.get('input[name="email"]').type('cypress@cypress.com');
    cy.get('input[name="password"]').type('cypress');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
  });
});
