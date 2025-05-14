describe('template spec', () => {
  it('Devrait se connecter avec des identifiants valides', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('testE2E@testE2E.com');
    cy.get('input[name="password"]').type('testE2E');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');
  })
})
