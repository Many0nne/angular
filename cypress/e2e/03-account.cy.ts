describe('Test de navigation vers le profil', () => {
  it('Devrait permettre à l\'utilisateur de naviguer vers son compte', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('testE2E@testE2E.com');
    cy.get('input[name="password"]').type('testE2E');
    cy.get('button[type="submit"]').click();
    cy.get('a[href="/account"]').click();
    cy.get('h1').should('contain', 'testE2E');
  });
});
