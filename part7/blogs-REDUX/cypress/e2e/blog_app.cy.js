describe('Blogg app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    const user2 = {
      name: 'Superuser',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('input').should('have.length', 2)
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('[name="Username"]').type('mluukkai')
      cy.get('[name="Password"]').type('salainen')
      cy.get('button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('[name="Username"]').type('mluukkai')
      cy.get('[name="Password"]').type('wrong')
      cy.get('button').click()

      cy.get('.notification')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({
        title: 'Generic title for tests!',
        author: 'Some Bot',
        url: 'www.beepboop.com'
      })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('[name="Title"]').type('Cypress test title')
      cy.get('[name="Author"]').type('Myself')
      cy.get('[name="Url"]').type('www.test.org')
      cy.get('[type="submit"]').click()

      cy.get('.notification')
        .should('contain', 'new blog \'Cypress test title\' by Myself added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('#root')
        .children()
        .children(':last-child')
        .should('contain', 'Cypress test title - Myself')
    })

    it('User can like a blog', function() {
      cy.contains('Generic title for tests!')
        .parent().as('theDiv')

      cy.get('@theDiv').find('button').contains('view').click()

      cy.get('@theDiv').find('button').contains('like').click()

      cy.get('@theDiv').contains('likes 1')
    })

    describe('Deleting blog post', function() {

      it('works when user is the creator', function() {
        cy.contains('Generic title for tests!')
          .parent().as('theDiv')

        cy.get('@theDiv').find('button').contains('view').click()
        cy.get('@theDiv').contains('delete').click()
        cy.contains('Blog \'Generic title for tests!\' was successfully deleted')
        cy.contains('Generic title for tests! - Some Bot').should('not.exist')
      })

      it('doesnt work when user is not the creator', function() {
        cy.contains('logout').click()
        cy.login({ username: 'root', password: 'salainen' })
        cy.contains('Superuser logged in')

        cy.contains('Generic title for tests!')
          .parent().as('theDiv')
        cy.get('@theDiv').contains('delete').should('not.exist')
        cy.get('@theDiv').find('.expanded').children().should('have.length', 4)
      })
    })

    it('Blogs are ordered according to likes', function() {
      cy.createBlog({
        title: 'First test blog!',
        author: 'Random',
        url: 'www.random.com'
      })
      cy.createBlog({
        title: 'Second test blog!',
        author: 'Jim',
        url: 'www.test.com'
      })

      cy.contains('Generic title for tests!')
        .parent().as('generic')
      cy.get('@generic').find('button').contains('view').click()

      cy.contains('First test blog!')
        .parent().as('first')
      cy.get('@first').find('button').contains('view').click()

      cy.contains('Second test blog!')
        .parent().as('second')
      cy.get('@second').find('button').contains('view').click()

      for(let n = 0; n < 2; n++) {
        cy.get('@first').contains('like').click()
        cy.wait(300)
      }
      cy.get('@second').contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'First test blog!')
      cy.get('.blog').eq(2).should('contain', 'Generic title for tests!')
    })
  })
})