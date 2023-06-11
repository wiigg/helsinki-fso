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

    describe('and a blog exists', () => {
      beforeEach(() => {
        cy.createBlog({
          title: 'Test Blog',
          author: 'Test Author',
          url: 'https://testurl.com',
        })
      })

      it('a blog can be liked', () => {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('a blog can be deleted by the user who created it', () => {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'Test Blog Test Author')
      })

      it('only a blog created by a user can remove it', () => {
        // check that the creator can remove the blog
        cy.contains('view').click()
        cy.get('#removeButton').should('be.visible')

        // create a second user
        const user = {
          name: 'Test User 2',
          username: 'testuser2',
          password: 'testpassword2',
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

        // log in as the second user
        cy.login({ username: 'testuser2', password: 'testpassword2' })

        // try to delete the blog created by the first user
        cy.contains('view').click()
        cy.get('#removeButton').should('not.be.visible')
      })
    })

    describe('and several blogs exist', () => {
      beforeEach(() => {
        cy.createBlog({
          title: 'First blog',
          author: 'Test Author 1',
          url: 'https://testurl1.com',
        })
        cy.createBlog({
          title: 'Second blog',
          author: 'Test Author 2',
          url: 'https://testurl2.com',
        })
        cy.createBlog({
          title: 'Third blog',
          author: 'Test Author 3',
          url: 'https://testurl3.com',
        })
      })

      it.only('blogs are ordered by number of likes', () => {
        cy.contains('First blog').as('firstBlog')
        cy.contains('Second blog').as('secondBlog')
        cy.contains('Third blog').as('thirdBlog')

        cy.contains('First blog').within(() => {
          cy.get('#viewButton').click()
          cy.get('#likeButton').click() // First like
        })
        cy.wait(1000)

        cy.contains('Second blog').within(() => {
          cy.get('#viewButton').click()
          cy.get('#likeButton').click() // First like
        })
        cy.wait(1000)
        cy.contains('Second blog').within(() => {
          cy.get('#likeButton').click() // First like
        })
        cy.wait(1000)
        cy.contains('Second blog').within(() => {
          cy.get('#likeButton').click() // First like
        })
        cy.wait(1000)

        cy.contains('Third blog').within(() => {
          cy.get('#viewButton').click()
          cy.get('#likeButton').click() // First like
        })
        cy.wait(1000)
        cy.contains('Third blog').within(() => {
          cy.get('#likeButton').click() // First like
        })

        cy.get('.blog').eq(0).should('contain', 'Second blog')
        cy.get('.blog').eq(1).should('contain', 'Third blog')
        cy.get('.blog').eq(2).should('contain', 'First blog')
      })
    })
  })
})
