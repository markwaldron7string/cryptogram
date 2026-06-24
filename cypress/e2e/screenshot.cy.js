const apiIntercept = () => {
  cy.intercept('GET', '**/api/coingecko*', (req) => {
    const path = new URL(req.url).searchParams.get('path')
    if (path === '/global') {
      req.reply({
        data: {
          total_market_cap: { usd: 2_650_000_000_000 },
          total_volume: { usd: 98_400_000_000 },
          market_cap_percentage: { btc: 52.8, eth: 16.4 },
          active_cryptocurrencies: 17_408,
          market_cap_change_percentage_24h_usd: 1.84,
        },
      })
      return
    }
    req.reply({ fixture: 'coins.json' })
  }).as('api')
}

describe('README screenshot', () => {
  beforeEach(apiIntercept)

  it('captures the homepage for documentation', () => {
    cy.visit('/')
    cy.wait('@api')
    cy.contains('Real-time crypto intelligence').should('be.visible')
    cy.contains('Bitcoin').should('be.visible')
    cy.screenshot('cryptogram-preview', { capture: 'viewport' })
  })
})
