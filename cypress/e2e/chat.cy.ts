describe('Test d\'envoi de message', () => {
  it('Devrait envoyer un message et l\'afficher dans le chat', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('cypress@cypress.com');
    cy.get('input[name="password"]').type('cypress');
    cy.get('button[type="submit"]').click();
    cy.get('input[placeholder="Type your message..."][class*="flex-grow"]').type('Test cypress');
    cy.get('button').contains('Envoyer').click();
    cy.get('.message-content').last().should('contain', 'Test cypress');
  });
});
