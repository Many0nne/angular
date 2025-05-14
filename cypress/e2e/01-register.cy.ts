describe('Test d\'inscription', () => {
  it('Devrait inscrire un utilisateur et rediriger vers la page de connexion', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('testE2E');
    cy.get('input[name="email"]').type('testE2E@testE2E.com');
    cy.get('input[name="password"]').type('testE2E');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
  });
});
