describe('Test de déconnexion', () => {
  it('Devrait déconnecter l\'utilisateur et rediriger vers la page de connexion', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('testE2E@testE2E.com');
    cy.get('input[name="password"]').type('testE2E');
    cy.get('button[type="submit"]').click();
    cy.get('a').contains('Sign Out').click();
    cy.url().should('include', '/login');
  });
});
