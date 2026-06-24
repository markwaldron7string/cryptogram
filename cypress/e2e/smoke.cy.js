describe('Cryptogram smoke test', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/coingecko*', (req) => {
      const path = new URL(req.url).searchParams.get('path')
      if (path === '/global') {
        req.reply({
          data: {
            total_market_cap: { usd: 2500000000000 },
            total_volume: { usd: 80000000000 },
            market_cap_percentage: { btc: 52.3, eth: 16.1 },
            active_cryptocurrencies: 10000,
            market_cap_change_percentage_24h_usd: 1.2,
          },
        })
        return
      }
      req.reply({ fixture: 'coins.json' })
    }).as('api')
  })

  it('loads the home page and renders coins', () => {
    cy.visit('/')
    cy.contains('Real-time crypto intelligence').should('be.visible')
    cy.wait('@api')
    cy.contains('Bitcoin').should('be.visible')
    cy.contains('Ethereum').should('be.visible')
  })
})
