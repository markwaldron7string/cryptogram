describe('Cryptogram content and interactions', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/coins/markets*', { fixture: 'coins.json' }).as('markets')
  })

  it('renders the coin table with fixture data', () => {
    cy.visit('/')
    cy.wait('@markets')
    cy.contains('Bitcoin').should('be.visible')
    cy.contains('Ethereum').should('be.visible')
    // Table headers present
    cy.contains('Market Cap').should('be.visible')
  })

  it('filters coins via search', () => {
    cy.visit('/')
    cy.wait('@markets')
    // Both coins visible initially
    cy.contains('Bitcoin').should('be.visible')
    cy.contains('Ethereum').should('be.visible')
    // Search for Bitcoin
    cy.get('input[placeholder="Search crypto..."]').type('Bitcoin')
    cy.get('button[type="submit"]').click()
    // Bitcoin stays, Ethereum filtered out
    cy.contains('Bitcoin').should('be.visible')
    cy.contains('Ethereum').should('not.exist')
  })

  it('opens the chart modal when a coin row is clicked', () => {
    cy.intercept('GET', '**/coins/*/market_chart*', { fixture: 'chart.json' }).as('chart')
    cy.visit('/')
    cy.wait('@markets')
    cy.contains('Bitcoin').click()
    cy.wait('@chart')
    // ChartModal renders "<coin name> Chart" as its heading.
    cy.contains('Bitcoin Chart').should('be.visible')
  })
})