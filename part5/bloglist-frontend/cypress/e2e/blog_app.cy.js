describe('Note app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3000/api/testing/reset/')

        let user = {
            name: 'El Notas',
            username: 'elnotas',
            password: 'pat1t0'
        }
        cy.request('POST', 'http://localhost:3000/api/users/', user)

        user = {
            name: 'Superuser',
            username: 'root',
            password: 'pat1t0'
        }
        cy.request('POST', 'http://localhost:3000/api/users/', user)

        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.contains('Welcome to blogList!')
        cy.contains('log in to application')
    })

    it('login form is visible', function() {
        cy.get('#username')
        cy.get('#password')
        cy.get('#login-button')
    })

    describe('login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('elnotas')
            cy.get('#password').type('pat1t0')
            cy.get('#login-button').click()

            cy.contains('elnotas logged in')
            cy.contains('El Notas logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('notauser')
            cy.get('#password').type('incorrect')
            cy.get('#login-button').click()

            cy.get('.notification')
                .should('contain', 'wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')

            cy.get('html').should('not.contain', 'El Notas logged in')
        })
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'elnotas', password: 'pat1t0' })
        })

        it('users can log out', function() {
            cy.contains('logout').click()

            cy.contains('elnotas logging out')
            cy.get('#username')
            cy.get('#password')
            cy.get('#login-button')
        })

        it('a new note can be created', function() {
            cy.contains('new blog').click()
            cy.get('#title-input').type('a blog created in testing')
            cy.get('#author-input').type('by cypress')
            cy.get('#url-input').type('an url by cypress')
            cy.get('#create-button').click()

            cy.contains('a blog created in testing by cypress')
            cy.contains('view').click()
            cy.contains('an url by cypress')
            cy.contains('El Notas')
        })

        it('a blog can be liked', function() {
            cy.createBlog({ title: 'blog to be like', author: 'cypress', url: 'like.io'})

            cy.contains('view').click()
            cy.get('.blogDetails')
                .should('contain', 'likes 0')
                .find('button').contains('like').click()
            cy.contains('like').click()
            cy.contains('likes 1')
        })

        it('blogs are ordered by likes', function() {
            cy.createBlog({ title: 'blog with no likes', author: 'cypressZero', url: 'like.io'})
            cy.createBlog({ title: 'blog with some likes', author: 'cypressTwo', url: 'like.io'})
            cy.createBlog({ title: 'blog with most likes', author: 'cypressFour', url: 'like.io'})

            cy.contains('view').click()
            cy.contains('view').click()
            cy.contains('view').click()

            cy.contains('blog with some likes').parent()
                .find('button').contains('like').click().click()

            cy.contains('blog with most likes').parent()
                .find('button').contains('like').click().click().click().click()

            cy.get('.blog').eq(0).should('contain', 'blog with most likes')
            cy.get('.blog').eq(1).should('contain', 'blog with some likes')
            cy.get('.blog').eq(2).should('contain', 'blog with no likes')
        })

        describe('blogs can be removed', function() {
            it('if the user created it', function() {
                cy.createBlog({ title: 'blog to delete', author: 'cypressDEL', url: 'bye.bye'})
                cy.createBlog({ title: 'blog to keep', author: 'cypress', url: 'like.io'})

                cy.contains('blog to keep')
                cy.contains('blog to delete')
                    .contains('view').click()
                cy.contains('remove').click()

                cy.get('html').should('not.contain', 'blog to delete')
                cy.contains('blog to keep')
            })

            it('but not if the user did not create it', function() {
                cy.createBlog({ title: 'blog by another user', author: 'cypress', url: 'endure.net'})

                cy.contains('logout').click()
                cy.login({ username: 'root', password: 'pat1t0' })

                cy.contains('view').click()
                cy.get('.blogDetails')
                    .should('not.contain', 'remove')
            })
        })
    })
})