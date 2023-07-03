describe('API Tests', () => {
  let accessToken;

  before(() => {
    cy.request('POST', 'http://localhost:3000/register', {
      email: 'olivier@mail.com',
      password: 'bestPassw0rd',
      firstname: 'Olivier',
      lastname: 'Monge',
      age: 32
    })
      .its('body.accessToken')
      .should('exist')
      .then((token) => {
        accessToken = token;
      });
  });

  it('should login with the registered user', () => {
    cy.request('POST', 'http://localhost:3000/login', {
      email: 'olivier@mail.com',
      password: 'bestPassw0rd'
    })
      .its('body.accessToken')
      .should('exist')
      .then((token) => {
        accessToken = token;
      });
  });

  it('should access a protected resource with a valid token', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/protected',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .its('status')
      .should('eq', 200);
  });

  it('should create a post (with an access token)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      body: {
        title: 'New Post',
        body: 'This is a new post'
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .its('status')
      .should('eq', 201);
  });

  it('should get all posts', () => {
    cy.request('GET', 'http://localhost:3000/posts')
      .its('status')
      .should('eq', 200);
  });
});

it('should login with the registered user', () => {
  cy.request('POST', 'http://localhost:3000/login', {
    email: user.email,
    password: user.password
  })
    .its('status')
    .should('eq', 200)
    .its('body.accessToken')
    .should('exist')
    .then((token) => {
      accessToken = token;
    });
});

it('should access a protected resource with a valid token', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:3000/protected',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .its('status')
    .should('eq', 200)
    .its('body')
    .should('deep.include', { email: user.email });
});

it('should get all posts', () => {
  cy.request('GET', 'http://localhost:3000/posts')
    .its('status')
    .should('eq', 200)
    .its('headers')
    .its('content-type')
    .should('include', 'application/json');
});

it('should get only the first 10 posts', () => {
  cy.request('GET', 'http://localhost:3000/posts?_limit=10')
    .its('status')
    .should('eq', 200)
    .its('body')
    .should('have.length', 10);
});

it('should get posts with specific IDs', () => {
  cy.request('GET', 'http://localhost:3000/posts?id=55&id=60')
    .its('status')
    .should('eq', 200)
    .its('body')
    .should('deep.include', [{ id: 55 }, { id: 60 }]);
});

it('should create a post (without an access token)', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/posts',
    failOnStatusCode: false
  })
    .its('status')
    .should('eq', 401);
});

it('should create a post (with an access token)', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/posts',
    body: {
      title: 'New Post',
      body: 'This is a new post'
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .its('status')
    .should('eq', 201);
});

it('should create a post entity', () => {
  cy.request('POST', 'http://localhost:3000/posts', {
    title: 'New Post',
    body: 'This is a new post'
  })
    .its('status')
    .should('eq', 201);
});

it('should update a non-existing entity', () => {
  cy.request({
    method: 'PUT',
    url: 'http://localhost:3000/posts/999',
    failOnStatusCode: false
  })
    .its('status')
    .should('eq', 404);
});

it('should create and update a post entity', () => {
  cy.request('POST', 'http://localhost:3000/posts', {
    title: 'New Post',
    body: 'This is a new post'
  })
    .then((response) => {
      const postId = response.body.id;

      cy.request({
        method: 'PUT',
        url: `http://localhost:3000/posts/${postId}`,
        body: {
          title: 'Updated Post',
          body: 'This post has been updated'
        }
      })
        .its('status')
        .should('eq', 200);
    });
});

it('should delete a non-existing post entity', () => {
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:3000/posts/999',
    failOnStatusCode: false
  })
    .its('status')
    .should('eq', 404);
});

it('should create, update, and delete a post entity', () => {
  cy.request('POST', 'http://localhost:3000/posts', {
    title: 'New Post',
    body: 'This is a new post'
  })
    .then((response) => {
      const postId = response.body.id;

      cy.request({
        method: 'PUT',
        url: `http://localhost:3000/posts/${postId}`,
        body: {
          title: 'Updated Post',
          body: 'This post has been updated'
        }
      })
        .its('status')
        .should('eq', 200);

      cy.request({
        method: 'DELETE',
        url: `http://localhost:3000/posts/${postId}`
      })
        .its('status')
        .should('eq', 200);
    });
});
