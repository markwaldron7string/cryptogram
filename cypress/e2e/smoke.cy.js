describe('Cryptogram smoke test', () => {
  beforeEach(() => {
    // Home fetches /coins/markets on load — intercept before visiting.
    cy.intercept('GET', '**/coins/markets*', { fixture: 'coins.json' }).as('markets')
  })

  it('loads the home page and renders coins', () => {
    cy.visit('/')
    cy.contains('The Elite').should('be.visible')        // hero heading
    cy.wait('@markets')                                   // confirm the API call fired
    cy.contains('Bitcoin').should('be.visible')           // fixture coin rendered
    cy.contains('Ethereum').should('be.visible')
  })
})