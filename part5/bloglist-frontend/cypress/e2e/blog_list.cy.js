describe('blog list', () => {
  beforeEach(() => {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    // create a test user
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpassword',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  })

  it('login form is shown on initial visit', () => {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('login', () => {
    it('fails with wrong credentials', () => {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpassword')
      cy.get('#loginButton').click()

      cy.get('.notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'backgroundColor', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Welcome, Test User')
    })

    it('succeeds with correct credentials', () => {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('#loginButton').click()

      cy.contains('Welcome, Test User')
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'testuser', password: 'testpassword' })
    })

    it('a new blog can be created', () => {
      cy.contains('new blog').click()

      cy.get('#titleInput').type('Test Blog')
      cy.get('#authorInput').type('Test Author')
      cy.get('#urlInput').type('https://testurl.com')
      cy.get('#submitButton').click()

      cy.contains('Test Blog Test Author')
    })

    it('a blog can be liked', () => {
      cy.contains('new blog').click()

      cy.get('#titleInput').type('Test Blog')
      cy.get('#authorInput').type('Test Author')
      cy.get('#urlInput').type('https://testurl.com')
      cy.get('#submitButton').click()

      cy.contains('Test Blog Test Author')
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('a blog can be deleted by the user who created it', () => {
      cy.contains('new blog').click()

      cy.get('#titleInput').type('Test Blog')
      cy.get('#authorInput').type('Test Author')
      cy.get('#urlInput').type('https://testurl.com')
      cy.get('#submitButton').click()

      cy.contains('Test Blog Test Author')
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'Test Blog Test Author')
    })

    it('a blog cannot be deleted by a user who did not create it', () => {
      // create a second user
      const user = {
        name: 'Test User 2',
        username: 'testuser2',
        password: 'testpassword2',
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

      // log in as the second user
      cy.login({ username: 'testuser2', password: 'testpassword2' })

      // create a blog as the first user
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Test Blog')
      cy.get('#authorInput').type('Test Author')
      cy.get('#urlInput').type('https://testurl.com')
      cy.get('#submitButton').click()

      cy.contains('Test Blog Test Author')

      // log out
      cy.contains('logout').click()

      // log back in as the first user
      cy.login({ username: 'testuser', password: 'testpassword' })

      // try to delete the blog as the first user
      cy.contains('Test Blog Test Author')
      cy.contains('view').click()
      cy.get('#removeButton').should('not.be.visible')
    })
  })
})
