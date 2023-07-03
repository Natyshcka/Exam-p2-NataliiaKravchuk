import user from "../fixtures/user.json"

describe('API Tests', () => {
  user.email
  user.password

  it('should get all posts', () => {
    cy.request('GET', 'http://localhost:3000/posts')
      .its('status')
      .should('eq', 200)

    cy.request('GET', 'http://localhost:3000/posts')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  })

  it('should get only first 10 posts', () => {
    cy.request('GET', 'http://localhost:3000/posts?_limit=10')
      .its('status')
      .should('eq', 200)

    cy.request('GET', 'http://localhost:3000/posts?_limit=10')
      .its('body')
      .should('have.length', 10)
  })

  it('should get posts with specific ids', () => {
    cy.request('GET', 'http://localhost:3000/posts?id=55&id=60')
      .its('status')
      .should('eq', 200)

    cy.request('GET', 'http://localhost:3000/posts?id=55&id=60')
      .its('body')
      .should('deep.include', [{ id: 55 }, { id: 60 }])
  })

  it('should create a post (without access token)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      failOnStatusCode: false
    })
      .its('status')
      .should('eq', 401)
  })

  it('should create a post (with access token)', () => {
    cy.get('@user').then((user) => {
      cy.request('POST', 'http://localhost:3000/posts', {
        title: 'New Post',
        body: 'This is a new post'
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
        .its('status')
        .should('eq', 201)
    })
  })

  it('should create a post entity', () => {
    cy.request('POST', 'http://localhost:3000/posts', {
      title: 'New Post',
      body: 'This is a new post'
    })
      .its('status')
      .should('eq', 201)
  })

  it('should update a non-existing entity', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:3000/posts/999',
      failOnStatusCode: false
    })
      .its('status')
      .should('eq', 404)
  })

  it('should create and update a post entity', () => {
    cy.request('POST', 'http://localhost:3000/posts', {
      title: 'New Post',
      body: 'This is a new post'
    })
      .then((response) => {
        const postId = response.body.id

        cy.request('PUT', `http://localhost:3000/posts/${postId}`, {
          title: 'Updated Post',
          body: 'This post has been updated'
        })
          .its('status')
          .should('eq', 200)
      })
  })

  it('should delete a non-existing post entity', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:3000/posts/999',
      failOnStatusCode: false
    })
      .its('status')
      .should('eq', 404)
  })

  it('should create, update, and delete a post entity', () => {
    cy.request('POST', 'http://localhost:3000/posts', {
      title: 'New Post',
      body: 'This is a new post'
    })
      .then((response) => {
        const postId = response.body.id

        cy.request('PUT', `http://localhost:3000/posts/${postId}`, {
          title: 'Updated Post',
          body: 'This post has been updated'
        })
          .its('status')
          .should('eq', 200)

        cy.request('DELETE', `http://localhost:3000/posts/${postId}`)
          .its('status')
          .should('eq', 200)
      })
  })
})


