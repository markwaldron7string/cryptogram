describe('Cryptogram content and interactions', () => {
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

  it('renders the coin table with fixture data', () => {
    cy.visit('/')
    cy.wait('@api')
    cy.contains('Bitcoin').should('be.visible')
    cy.contains('Ethereum').should('be.visible')
    cy.contains('Market Cap').should('be.visible')
  })

  it('filters coins via search', () => {
    cy.visit('/')
    cy.wait('@api')
    cy.contains('Bitcoin').should('be.visible')
    cy.contains('Ethereum').should('be.visible')
    cy.get('input[placeholder="Search by name or symbol..."]').type('Bitcoin')
    cy.contains('Bitcoin').should('be.visible')
    cy.contains('Ethereum').should('not.exist')
  })

  it('opens the chart modal when the quick chart button is clicked', () => {
    cy.intercept('GET', '**/api/coingecko*', (req) => {
      const path = new URL(req.url).searchParams.get('path')
      if (path?.includes('market_chart')) {
        req.reply({ fixture: 'chart.json' })
        return
      }
      if (path === '/global') {
        req.reply({ data: {} })
        return
      }
      req.reply({ fixture: 'coins.json' })
    }).as('api')
    cy.visit('/')
    cy.wait('@api')
    cy.get('[aria-label="Quick chart for Bitcoin"]').click({ force: true })
    cy.contains('View full details').should('be.visible')
    cy.contains('Bitcoin').should('be.visible')
  })

  it('navigates to coin detail page when a row is clicked', () => {
    cy.intercept('GET', '**/api/coingecko*', (req) => {
      const path = new URL(req.url).searchParams.get('path')
      if (path === '/coins/bitcoin') {
        req.reply({ fixture: 'coin-detail.json' })
        return
      }
      if (path?.includes('market_chart')) {
        req.reply({ fixture: 'chart.json' })
        return
      }
      if (path === '/global') {
        req.reply({ data: {} })
        return
      }
      req.reply({ fixture: 'coins.json' })
    }).as('coinPage')

    cy.visit('/')
    cy.wait('@coinPage')
    cy.contains('Bitcoin').click()
    cy.url().should('include', '/coin/bitcoin')
    cy.contains('BTC').should('be.visible')
  })

  it('switches market tabs', () => {
    cy.visit('/')
    cy.wait('@api')
    cy.contains('button', 'Gainers').click()
    cy.contains('button', 'Losers').click()
    cy.contains('button', 'Watchlist').click()
  })
})
