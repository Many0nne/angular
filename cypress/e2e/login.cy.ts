describe('template spec', () => {
  it('Devrait se connecter avec des identifiants valides', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('cypress@cypress.com');
    cy.get('input[name="password"]').type('cypress');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');
  })
})
