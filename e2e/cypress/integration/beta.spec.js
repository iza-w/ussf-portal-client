describe('the Beta gate', () => {
  before(() => {
    cy.loginTestIDP()
  })

  beforeEach(() => {
    cy.preserveLoginCookies()
  })

  it('joins and leaves the beta', () => {
    // Start on MVP
    cy.contains('Manage your life')

    // Join the beta
    cy.contains('Join beta').click()

    cy.findByRole('dialog').within(() => {
      cy.contains('Join the beta')
      cy.contains('Join beta').click()
    })

    cy.contains('My Space')
    cy.url().should('contain', '/')

    // Leave the beta
    cy.contains('Click here to leave the beta.').within(() => {
      cy.contains('Click here').click()
    })

    // Return to MVP
    cy.contains('Manage your life')
  })
})
