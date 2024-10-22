describe('The Authentication flow', () => {
  describe('access without being logged in', () => {
    it('requires a user to be logged in to view MVP pages', () => {
      cy.clearCookies()
      const mvpRoutes = [
        '/',
        '/about-us',
        '/about-us/accomplishments',
        '/news',
        '/training-and-education',
        'training-and-education/force-multiplier-program',
      ]

      mvpRoutes.forEach((url) => {
        cy.visit(url)
        cy.url().should('match', /login/)
      })
    })

    it('requires a user to be logged in to view beta pages', () => {
      cy.clearCookies()
      cy.visit('/joinbeta')

      const betaRoutes = ['/', '/sites-and-applications']

      betaRoutes.forEach((url) => {
        cy.visit(url)
        cy.url().should('match', /login/)
      })
    })
  })

  describe('logging in', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/logout').as('logout')

      cy.intercept(
        {
          method: 'GET',
          url: '**/simplesaml/saml2/idp/SingleLogoutService.php*',
        },
        {
          statusCode: 200,
          body: 'Logged out',
        }
      ).as('testIDPLogout')
    })

    it('a user can log into and out of the MVP site', () => {
      cy.loginTestIDP()
      cy.visit('/')
      cy.contains('Manage your life')
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      cy.contains('Log out').click()
      cy.wait('@logout')

      cy.visit('/')
      cy.url().should('match', /login/)
    })

    it('a user can log into and out of the beta site', () => {
      cy.loginTestIDP()
      cy.visit('/joinbeta')

      cy.visit('/')
      cy.contains('My Space')
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      cy.contains('Log out').click()
      cy.wait('@logout')

      cy.visit('/')
      cy.url().should('match', /login/)
    })
  })

  describe('access while logged in', () => {
    before(() => {
      cy.loginTestIDP()
    })

    beforeEach(() => {
      cy.intercept('GET', '/api/auth/user').as('getUser')
      cy.preserveLoginCookies()
    })

    it('can load the user on MVP pages', () => {
      const mvpRoutes = [
        '/',
        '/about-us',
        '/about-us/accomplishments',
        '/news',
        '/training-and-education',
        'training-and-education/force-multiplier-program',
      ]

      mvpRoutes.forEach((url) => {
        cy.visit(url)
        cy.wait('@getUser')
          .its('response.statusCode')
          .should('be.oneOf', [200, 304])
      })
    })

    it('can load the user on beta pages', () => {
      cy.visit('/joinbeta')

      const betaRoutes = ['/', '/sites-and-applications']

      betaRoutes.forEach((url) => {
        cy.visit(url)
        cy.wait('@getUser')
          .its('response.statusCode')
          .should('be.oneOf', [200, 304])
      })
    })
  })

  describe.only('showing user-specific data', () => {
    before(() => {
      // Reset the database
      cy.task('db:seed')
    })

    it('logging in as Test User 1 loads their My Space data', () => {
      cy.loginTestIDP()
      cy.visit('/joinbeta')

      cy.contains('My Space')
      cy.contains('Welcome, Test User')

      cy.contains('Example Collection')
      cy.contains('Second Collection')
    })

    it('logging in as Test User 2 loads their My Space data', () => {
      cy.loginTestIDP({ username: 'user2', password: 'user2pass' })
      cy.visit('/joinbeta')

      cy.contains('My Space')
      cy.contains('Welcome, Second Tester')
      cy.contains('Third Collection')
    })
  })
})
